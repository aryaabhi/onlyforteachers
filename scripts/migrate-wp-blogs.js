import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import xml2js from 'xml2js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })

const isTest = process.argv.includes('--test')
const isDeleteTest = process.argv.includes('--delete-test')

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('Error: SANITY_WRITE_TOKEN is not set. Add it to scripts/.env')
  process.exit(1)
}

const sanity = createClient({
  projectId: 'jg82obhk',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _keyCounter = 0
const uid = () => (++_keyCounter).toString(36)

// xml2js wraps every text value in an array; unwrap it
function val(v) {
  if (v == null) return ''
  if (Array.isArray(v)) return val(v[0])
  if (typeof v === 'object' && v._ != null) return String(v._)
  return String(v)
}

function getPostMeta(item, key) {
  const metas = item['wp:postmeta'] ?? []
  for (const meta of metas) {
    if (val(meta['wp:meta_key']) === key) return val(meta['wp:meta_value'])
  }
  return null
}

function getCategories(item) {
  const cats = item['category'] ?? []
  return cats
    .filter(c => c?.$ && c.$.domain === 'category')
    .map(c => val(c))
    .filter(Boolean)
}

function extractFirstImageUrl(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"/i)
  return m ? m[1] : null
}

function decodeHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
}

function stripTags(html) {
  return decodeHtml(html).trim()
}

// ─── Image upload ─────────────────────────────────────────────────────────────

async function uploadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const filename = url.split('/').pop().split('?')[0]
  const asset = await sanity.assets.upload('image', buffer, { filename, contentType })
  return asset._id
}

// ─── HTML → Portable Text ─────────────────────────────────────────────────────

function parseInlineSpans(html) {
  const spans = []

  // Annotate marks with sentinel characters before stripping tags
  const annotated = html
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `\x01strong\x02${t}\x03`)
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `\x01em\x02${t}\x03`)
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_, href, t) => `\x01link:${href}\x02${t}\x03`)

  for (const part of annotated.split(/(\x01[^\x02]*\x02[\s\S]*?\x03)/g)) {
    if (!part) continue
    const marked = part.match(/^\x01([^\x02]*)\x02([\s\S]*)\x03$/)
    if (marked) {
      const [, markRaw, inner] = marked
      const text = decodeHtml(inner)
      if (!text.trim()) continue
      if (markRaw.startsWith('link:')) {
        const key = uid()
        spans.push({ _type: 'span', _key: uid(), text, marks: [key], _linkKey: key, _href: markRaw.slice(5) })
      } else {
        spans.push({ _type: 'span', _key: uid(), text, marks: [markRaw] })
      }
    } else {
      const text = decodeHtml(part)
      if (text.trim()) spans.push({ _type: 'span', _key: uid(), text, marks: [] })
    }
  }

  return spans
}

function collectMarkDefs(spans) {
  const defs = []
  for (const span of spans) {
    if (span._linkKey) {
      defs.push({ _type: 'link', _key: span._linkKey, href: span._href })
      delete span._linkKey
      delete span._href
    }
  }
  return defs
}

const BLOCK_TAG_STYLE = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  p: 'normal', blockquote: 'blockquote' }

async function htmlToPortableText(html) {
  if (!html) return []

  const blocks = []
  // Strip Gutenberg block comment markers
  const clean = html.replace(/<!--.*?-->/gs, '')

  // Match block-level elements (ul/ol handled as containers), and self-closing imgs
  const tokenRe = /<(h[1-6]|p|blockquote|ul|ol)(?:\s[^>]*)?>([^]*?)<\/\1>|<img\s([^>]*)>/gi
  let m

  while ((m = tokenRe.exec(clean)) !== null) {
    if (m[1]) {
      const tag = m[1].toLowerCase()

      if (tag === 'ul' || tag === 'ol') {
        // Each <li> inside becomes a listItem block
        const listItem = tag === 'ul' ? 'bullet' : 'number'
        const liRe = /<li(?:\s[^>]*)?>([^]*?)<\/li>/gi
        let li
        while ((li = liRe.exec(m[2])) !== null) {
          const spans = parseInlineSpans(li[1])
          if (spans.length === 0) continue
          blocks.push({
            _type: 'block',
            _key: uid(),
            style: 'normal',
            listItem,
            level: 1,
            markDefs: collectMarkDefs(spans),
            children: spans,
          })
        }
        continue
      }

      // Regular block element
      const style = BLOCK_TAG_STYLE[tag]
      if (!style) continue
      const spans = parseInlineSpans(m[2])
      if (spans.length === 0) continue
      blocks.push({
        _type: 'block',
        _key: uid(),
        style,
        markDefs: collectMarkDefs(spans),
        children: spans,
      })
    } else {
      // <img> — download and upload
      const attrs = {}
      const attrRe = /(\w[\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
      let a
      while ((a = attrRe.exec(m[3])) !== null) attrs[a[1]] = a[2] ?? a[3] ?? a[4] ?? true
      if (!attrs.src) continue
      try {
        const assetId = await uploadImage(attrs.src)
        blocks.push({
          _type: 'image',
          _key: uid(),
          asset: { _type: 'reference', _ref: assetId },
        })
      } catch (err) {
        console.warn(`    ⚠️  Skipped inline image ${attrs.src}: ${err.message}`)
      }
    }
  }

  return blocks
}

// ─── Migration ────────────────────────────────────────────────────────────────

async function migrate() {
  const xmlPath = join(__dirname, 'wordpress-export.xml')
  const xml = readFileSync(xmlPath, 'utf8')

  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: true, trim: true })
  const items = parsed?.rss?.channel?.[0]?.item ?? []

  let posts = items.filter(
    item => val(item['wp:post_type']) === 'post' && val(item['wp:status']) === 'publish'
  )

  if (isDeleteTest) {
    const firstPost = posts[0]
    if (!firstPost) { console.log('No published posts found.'); return }
    const docId = `wp-${val(firstPost['wp:post_id'])}`
    const title = val(firstPost.title)
    console.log(`Deleting test post: "${title}" (${docId})...`)
    try {
      await sanity.delete(docId)
      console.log(`✅ Deleted: ${docId}`)
    } catch (err) {
      console.warn(`⚠️  Delete failed (may not exist yet): ${err.message}`)
    }
    return
  }

  if (isTest) {
    console.log('--test flag detected: migrating first post only')
    posts = posts.slice(0, 1)
  }

  console.log(`Starting migration of ${posts.length} post${posts.length === 1 ? '' : 's'}...`)

  let succeeded = 0
  let failed = 0

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i]
    const title = val(item.title)
    console.log(`Migrating [${i + 1}/${posts.length}]: ${title}...`)

    try {
      const slug = val(item['wp:post_name'])
      const rawContent = val(item['content:encoded'])
      const excerpt = stripTags(val(item['excerpt:encoded']))
      const date = val(item['wp:post_date_gmt']) || val(item['wp:post_date'])
      const categories = getCategories(item)

      const yoastTitle = getPostMeta(item, '_yoast_wpseo_title')
      const yoastDesc = getPostMeta(item, '_yoast_wpseo_metadesc')

      // Featured image: first <img> in content
      let mainImage
      const featuredUrl = extractFirstImageUrl(rawContent)
      if (featuredUrl) {
        try {
          const assetId = await uploadImage(featuredUrl)
          mainImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
        } catch (err) {
          console.warn(`    ⚠️  Skipped featured image: ${err.message}`)
        }
      }

      const body = await htmlToPortableText(rawContent)

      const doc = {
        _type: 'post',
        _id: `wp-${val(item['wp:post_id'])}`,
        title,
        slug: { _type: 'slug', current: slug },
        publishedAt: new Date(date).toISOString(),
        ...(excerpt && { excerpt }),
        ...(categories.length && { categories }),
        body,
        ...(mainImage && { mainImage }),
        ...(yoastTitle && { seoTitle: yoastTitle }),
        ...(yoastDesc && { seoDescription: yoastDesc }),
      }

      await sanity.createOrReplace(doc)
      console.log(`✅ Done: ${title}`)
      succeeded++
    } catch (err) {
      console.warn(`⚠️ Failed: ${title} - ${err.message}`)
      failed++
    }
  }

  console.log(`Migration complete: ${succeeded} succeeded, ${failed} failed`)
}

migrate().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
