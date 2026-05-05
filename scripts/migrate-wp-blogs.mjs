import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import xml2js from 'xml2js'
import fetch from 'node-fetch'
import FormData from 'form-data'

const sanity = createClient({
  projectId: 'jg82obhk',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Image upload ─────────────────────────────────────────────────────────────

async function downloadAndUpload(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/jpeg'

  const asset = await sanity.assets.upload('image', buffer, {
    filename,
    contentType,
  })
  return asset
}

// ─── HTML → Portable Text ─────────────────────────────────────────────────────

function textToSpans(text) {
  if (!text) return []
  return [{ _type: 'span', _key: uid(), text, marks: [] }]
}

let _uidCounter = 0
function uid() {
  return (++_uidCounter).toString(36)
}

function extractText(node) {
  if (typeof node === 'string') return node
  if (!node) return ''
  const children = node.childNodes || []
  return children.map(extractText).join('')
}

// Parse a JSDOM/parse5 element tree into Portable Text blocks.
// We use a simple regex-based approach to avoid a large DOM parser dependency.
async function htmlToPortableText(html) {
  if (!html) return []

  const blocks = []

  // Strip Gutenberg block comment markers
  const cleaned = html.replace(/<!--.*?-->/gs, '')

  // Split on block-level tags to get segments
  // We'll process the HTML tag by tag using a simple tokeniser
  const segments = tokeniseBlocks(cleaned)

  for (const seg of segments) {
    const { tag, inner, attrs } = seg

    if (tag === 'img') {
      const src = attrs.src
      if (src) {
        try {
          const filename = src.split('/').pop().split('?')[0]
          const asset = await downloadAndUpload(src, filename)
          blocks.push({
            _type: 'image',
            _key: uid(),
            asset: { _type: 'reference', _ref: asset._id },
          })
        } catch (err) {
          console.warn(`    ⚠️  Skipped inline image ${attrs.src}: ${err.message}`)
        }
      }
      continue
    }

    const style = tagToStyle(tag)
    if (!style) continue

    const spans = parseInlineHtml(inner)
    if (spans.length === 0 && style === 'normal') continue

    blocks.push({
      _type: 'block',
      _key: uid(),
      style,
      markDefs: collectLinkDefs(spans),
      children: spans,
    })
  }

  return blocks
}

function tagToStyle(tag) {
  switch (tag) {
    case 'h1': return 'h1'
    case 'h2': return 'h2'
    case 'h3': return 'h3'
    case 'h4': return 'h4'
    case 'h5': return 'h5'
    case 'h6': return 'h6'
    case 'p':  return 'normal'
    case 'blockquote': return 'blockquote'
    case 'li': return 'normal'
    default:   return null
  }
}

// Very small tokeniser: extracts top-level block elements + self-closing <img>
function tokeniseBlocks(html) {
  const blockTags = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'div', 'figure', 'section'])
  const results = []

  // Self-closing img tags
  const imgRe = /<img\s([^>]*)>/gi
  let m
  while ((m = imgRe.exec(html)) !== null) {
    results.push({ tag: 'img', inner: '', attrs: parseAttrs(m[1]), offset: m.index })
  }

  // Block elements
  for (const tag of blockTags) {
    const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi')
    while ((m = re.exec(html)) !== null) {
      results.push({ tag, inner: m[1], attrs: parseAttrs(''), offset: m.index })
    }
  }

  // Sort by source order
  results.sort((a, b) => a.offset - b.offset)

  // De-duplicate overlapping matches (nested blocks): keep outermost or innermost?
  // We want innermost meaningful blocks (e.g. <p> inside <li> would conflict — keep <p>).
  // Simple approach: if a range is fully contained in a previous range's span, skip the outer one.
  // Since we've sorted by offset, just drop entries that start inside the previous entry's span.
  const deduped = []
  let lastEnd = -1
  for (const seg of results) {
    if (seg.tag === 'img') {
      deduped.push(seg)
      continue
    }
    // Approximate end by inner length
    const approxStart = seg.offset
    if (approxStart < lastEnd) continue
    deduped.push(seg)
    lastEnd = approxStart + seg.inner.length + seg.tag.length * 2 + 5
  }

  return deduped
}

function parseAttrs(attrStr) {
  const attrs = {}
  const re = /(\w[\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
  let m
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? true
  }
  return attrs
}

// Parse inline HTML (spans, strong, em, a, etc.) into Portable Text children
function parseInlineHtml(html) {
  const spans = []
  const text = html
    // Collect marks with their text
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `\x01strong\x02${inner}\x03`)
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `\x01em\x02${inner}\x03`)
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) =>
      `\x01link:${href}\x02${inner}\x03`)

  // Now iterate over the annotated string
  const parts = text.split(/(\x01[^\x02]*\x02[\s\S]*?\x03)/g)
  for (const part of parts) {
    if (!part) continue
    const markedMatch = part.match(/^\x01([^\x02]*)\x02([\s\S]*)\x03$/)
    if (markedMatch) {
      const [, markRaw, inner] = markedMatch
      const cleanInner = stripTags(inner)
      if (!cleanInner) continue
      if (markRaw.startsWith('link:')) {
        const href = markRaw.slice(5)
        const key = uid()
        spans.push({ _type: 'span', _key: uid(), text: cleanInner, marks: [key], _linkKey: key, _href: href })
      } else {
        spans.push({ _type: 'span', _key: uid(), text: cleanInner, marks: [markRaw] })
      }
    } else {
      const clean = stripTags(part)
      if (clean.trim()) {
        spans.push({ _type: 'span', _key: uid(), text: clean, marks: [] })
      }
    }
  }

  return spans
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
}

function collectLinkDefs(spans) {
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

// ─── XML parsing helpers ──────────────────────────────────────────────────────

function cdata(val) {
  if (!val) return ''
  if (Array.isArray(val)) return cdata(val[0])
  if (typeof val === 'object' && val._) return val._
  return String(val)
}

function getPostMeta(item, key) {
  const metas = item['wp:postmeta'] || []
  for (const meta of metas) {
    if (cdata(meta['wp:meta_key']) === key) {
      return cdata(meta['wp:meta_value'])
    }
  }
  return null
}

function getCategories(item) {
  const cats = item['category'] || []
  return cats
    .filter(c => {
      const domain = c.$ && c.$.domain
      return domain === 'category'
    })
    .map(c => cdata(c))
    .filter(Boolean)
}

// Extract the first <img src="..."> from HTML content
function extractFirstImageUrl(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"/i)
  return m ? m[1] : null
}

// ─── Main migration ───────────────────────────────────────────────────────────

async function migrate() {
  const xml = readFileSync('scripts/wordpress-export.xml', 'utf8')
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: true })

  const items = parsed.rss.channel[0].item || []
  const posts = items.filter(item =>
    cdata(item['wp:post_type']) === 'post' &&
    cdata(item['wp:status']) === 'publish'
  )

  console.log(`Starting migration of ${posts.length} posts...`)

  let succeeded = 0
  let failed = 0

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i]
    const title = cdata(item.title)
    console.log(`Migrating [${i + 1}/${posts.length}]: ${title}...`)

    try {
      const slug = cdata(item['wp:post_name'])
      const rawContent = cdata(item['content:encoded'])
      const excerpt = cdata(item['excerpt:encoded'])
      const date = cdata(item['wp:post_date'])
      const categories = getCategories(item)

      const yoastTitle = getPostMeta(item, '_yoast_wpseo_title')
      const yoastDesc = getPostMeta(item, '_yoast_wpseo_metadesc')

      // Featured image: first <img> in content
      let mainImage = null
      const featuredUrl = extractFirstImageUrl(rawContent)
      if (featuredUrl) {
        try {
          const filename = featuredUrl.split('/').pop().split('?')[0]
          const asset = await downloadAndUpload(featuredUrl, filename)
          mainImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
          }
        } catch (err) {
          console.warn(`    ⚠️  Skipped featured image: ${err.message}`)
        }
      }

      // Convert content to Portable Text
      const body = await htmlToPortableText(rawContent)

      const doc = {
        _type: 'post',
        _id: `wp-${cdata(item['wp:post_id'])}`,
        title,
        slug: { _type: 'slug', current: slug },
        publishedAt: new Date(date).toISOString(),
        excerpt: excerpt || undefined,
        categories,
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
  console.error('Fatal error:', err)
  process.exit(1)
})
