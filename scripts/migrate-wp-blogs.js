const { createClient } = require('@sanity/client')
const fs = require('fs')
const { parseString } = require('xml2js')
const { promisify } = require('util')

const parseXml = promisify(parseString)

const client = createClient({
  projectId: 'jg82obhk',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function htmlToPortableText(html) {
  if (!html) return []

  const blocks = []
  // Split on block-level tags
  const parts = html.split(/<\/?(p|h[1-6]|blockquote|ul|ol|li)[^>]*>/i).filter(p => p.trim())

  for (const part of parts) {
    const clean = part.replace(/<[^>]+>/g, '').trim()
    if (!clean) continue

    blocks.push({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2),
          text: clean,
          marks: [],
        },
      ],
    })
  }

  return blocks
}

function extractYoastMeta(item, metaKey) {
  const postmeta = item['wp:postmeta'] ?? []
  for (const meta of postmeta) {
    const key = Array.isArray(meta['wp:meta_key']) ? meta['wp:meta_key'][0] : meta['wp:meta_key']
    if (key === metaKey) {
      const val = Array.isArray(meta['wp:meta_value']) ? meta['wp:meta_value'][0] : meta['wp:meta_value']
      return val || null
    }
  }
  return null
}

async function migrate() {
  const xmlPath = './scripts/wordpress-export.xml'

  if (!fs.existsSync(xmlPath)) {
    console.error(`Export file not found at ${xmlPath}`)
    process.exit(1)
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN env var is required')
    process.exit(1)
  }

  const xml = fs.readFileSync(xmlPath, 'utf8')
  const parsed = await parseXml(xml)

  const items = parsed?.rss?.channel?.[0]?.item ?? []
  const posts = items.filter(
    item => (item['wp:post_type']?.[0] === 'post') && (item['wp:status']?.[0] === 'publish')
  )

  console.log(`Found ${posts.length} published posts to migrate`)

  let migrated = 0

  for (const item of posts) {
    const title = Array.isArray(item.title) ? item.title[0] : item.title
    const rawSlug = Array.isArray(item['wp:post_name'])
      ? item['wp:post_name'][0]
      : (item['wp:post_name'] || '')
    const slug = rawSlug || slugify(title)

    const content = Array.isArray(item['content:encoded'])
      ? item['content:encoded'][0]
      : (item['content:encoded'] || '')
    const excerpt = Array.isArray(item['excerpt:encoded'])
      ? item['excerpt:encoded'][0]
      : (item['excerpt:encoded'] || '')
    const pubDate = Array.isArray(item['wp:post_date_gmt'])
      ? item['wp:post_date_gmt'][0]
      : (item['wp:post_date_gmt'] || item.pubDate?.[0] || '')

    const seoTitle = extractYoastMeta(item, '_yoast_wpseo_title')
    const seoDescription = extractYoastMeta(item, '_yoast_wpseo_metadesc')
    const featuredImageId = extractYoastMeta(item, '_thumbnail_id')

    console.log(`Migrating: ${title}`)

    const doc = {
      _type: 'post',
      _id: `wordpress-${slug}`,
      title: title || 'Untitled',
      slug: { _type: 'slug', current: slug },
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      excerpt: excerpt.replace(/<[^>]+>/g, '').trim() || null,
      body: htmlToPortableText(content),
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    }

    try {
      await client.createOrReplace(doc)
      migrated++
    } catch (err) {
      console.error(`  Failed: ${err.message}`)
    }
  }

  console.log(`Migration complete: ${migrated} posts migrated`)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
