import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  readManifest,
  updateResourceStatus,
  shouldProcess,
  type ResourceManifestItem,
} from './manifest'
import { generateHtml, type HtmlTemplateData } from './html-template'
import { extractThumbnail } from './thumbnail'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_DIR = join(__dirname, '..', '..')

// Source resources file path
const RESOURCES_FILE =
  'D:\\MyWork\\resources\\openclaw101\\src\\data\\resources.ts'

// Process language: 'zh' for Chinese, 'en' for English
const PROCESS_LANG = 'zh'

// Processed content output directory
const PROCESSED_DIR = join(PROJECT_DIR, 'content', 'processed')

interface Resource {
  title: string
  desc: string
  url: string
  source: string
  sourceIcon?: string
  lang: 'zh' | 'en'
  category: string
  featured?: boolean
  tags?: string[]
}

/**
 * Generate unique ID from URL
 */
function generateId(url: string): string {
  // Create a simple hash from URL
  const hash = url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .slice(0, 50)
  return hash
}

/**
 * Load resources from source file
 */
async function loadResources(): Promise<Resource[]> {
  console.log(`Loading resources from ${RESOURCES_FILE}...`)

  // Dynamic import to load TypeScript file
  const resourcesModule = await import(RESOURCES_FILE)
  const allResources: Resource[] = resourcesModule.resources || []

  // Filter by language
  const filtered = allResources.filter((r) => r.lang === PROCESS_LANG)
  console.log(`Found ${filtered.length} ${PROCESS_LANG} resources`)

  return filtered
}

/**
 * Fetch URL content and convert to markdown
 * Uses baoyu-url-to-markdown skill
 */
async function fetchContent(url: string): Promise<string | null> {
  try {
    // Use the baoyu-url-to-markdown skill via MCP
    // For now, we'll use a simple fetch approach
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Simple HTML to text conversion (basic)
    // In production, would use proper HTML parser
    let content = html
      // Remove scripts
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      // Remove styles
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Replace headers with markdown
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
      // Replace paragraphs
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
      // Replace links
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      // Replace images
      .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![image]($1)')
      // Replace lists
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
      // Replace divs and spans
      .replace(/<div[^>]*>|<\/div>/gi, '\n')
      .replace(/<span[^>]*>|<\/span>/gi, '')
      // Remove other HTML tags but keep text
      .replace(/<[^>]+>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return content
  } catch (error) {
    console.log(`Error fetching ${url}:`, error)
    return null
  }
}

/**
 * Process a single resource
 */
async function processResource(resource: Resource): Promise<void> {
  const id = generateId(resource.url)

  // Check if should process
  if (!shouldProcess(id, resource.url)) {
    console.log(`Skipping ${id} (already processed)`)
    return
  }

  console.log(`Processing: ${resource.title}`)

  // Update status to processing
  updateResourceStatus(id, {
    status: 'processing',
    title: resource.title,
    sourceUrl: resource.url,
    source: resource.source,
    category: resource.category,
  })

  try {
    // Fetch content
    const content = await fetchContent(resource.url)

    // Extract thumbnail
    const thumbnail = await extractThumbnail(resource.url, id)

    // Generate HTML
    const htmlData: HtmlTemplateData = {
      title: resource.title,
      content: content || `<p>${resource.desc}</p>`,
      source: resource.source,
      sourceUrl: resource.url,
      description: resource.desc,
    }

    const html = generateHtml(htmlData)

    // Ensure directory exists
    if (!existsSync(PROCESSED_DIR)) {
      mkdirSync(PROCESSED_DIR, { recursive: true })
    }

    // Write HTML file
    const outputPath = join(PROCESSED_DIR, `${id}.html`)
    writeFileSync(outputPath, html, 'utf-8')

    console.log(`  → Saved: ${outputPath}`)

    // Update status to done
    updateResourceStatus(id, {
      status: 'done',
      title: resource.title,
      sourceUrl: resource.url,
      source: resource.source,
      category: resource.category,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`  → Error:`, error)

    // Update status to failed
    updateResourceStatus(id, {
      status: 'failed',
      title: resource.title,
      sourceUrl: resource.url,
      source: resource.source,
      category: resource.category,
      error: String(error),
    })
  }
}

/**
 * Main processing function
 */
async function main() {
  console.log('='.repeat(50))
  console.log('LeanClaw Resource Sync')
  console.log(`Processing language: ${PROCESS_LANG}`)
  console.log('='.repeat(50))

  // Load resources
  const resources = await loadResources()

  console.log(`\nTotal resources to process: ${resources.length}`)

  // Process each resource
  let processed = 0
  let skipped = 0
  let failed = 0

  for (const resource of resources) {
    const id = generateId(resource.url)

    if (!shouldProcess(id, resource.url)) {
      skipped++
      continue
    }

    await processResource(resource)
    processed++

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(50))
  console.log('Summary:')
  console.log(`  Processed: ${processed}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Failed: ${failed}`)
  console.log('='.repeat(50))
}

// Run if called directly
main().catch(console.error)
