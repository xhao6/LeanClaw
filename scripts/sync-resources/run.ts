#!/usr/bin/env bun

/**
 * LeanClaw Resource Sync Script
 *
 * Usage:
 *   bun run scripts/sync-resources/index.ts
 *
 * Environment:
 *   LANG=zh|en  - Language to process (default: zh)
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_DIR = join(__dirname, '..', '..')

// Source resources file path
const RESOURCES_FILE =
  'D:\\MyWork\\resources\\openclaw101\\src\\data\\resources.ts'

// Process language from env or default to 'zh'
const PROCESS_LANG = (process.env.LANG || 'zh') as 'zh' | 'en'

// Processed content output directory
const PROCESSED_DIR = join(PROJECT_DIR, 'content', 'processed')
const MANIFEST_PATH = join(PROJECT_DIR, 'content', 'manifest.json')

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

interface Manifest {
  lastSync: string
  resources: Record<string, ResourceManifestItem>
}

interface ResourceManifestItem {
  status: 'pending' | 'processing' | 'done' | 'failed'
  title: string
  sourceUrl: string
  source?: string
  category?: string
  processedAt?: string
  error?: string
}

/**
 * Generate unique ID from URL
 */
function generateId(url: string): string {
  return url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .slice(0, 50)
}

/**
 * Read manifest
 */
function readManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) {
    return { lastSync: '', resources: {} }
  }
  try {
    const content = readFileSync(MANIFEST_PATH, 'utf-8')
    return JSON.parse(content)
  } catch {
    return { lastSync: '', resources: {} }
  }
}

/**
 * Write manifest
 */
function writeManifest(manifest: Manifest): void {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
}

/**
 * Check if resource should be processed
 */
function shouldProcess(id: string, url: string): boolean {
  const manifest = readManifest()
  const existing = manifest.resources[id]

  if (!existing) return true
  if (existing.status === 'failed') return true
  if (existing.sourceUrl !== url) return true

  return false
}

/**
 * Update resource status
 */
function updateResourceStatus(
  id: string,
  item: ResourceManifestItem
): void {
  const manifest = readManifest()
  manifest.resources[id] = item
  manifest.lastSync = new Date().toISOString()
  writeManifest(manifest)
}

/**
 * Load resources from source file
 */
async function loadResources(): Promise<Resource[]> {
  console.log(`Loading resources from ${RESOURCES_FILE}...`)

  const resourcesModule = await import(RESOURCES_FILE)
  const allResources: Resource[] = resourcesModule.resources || []

  // Filter by language
  const filtered = allResources.filter((r) => r.lang === PROCESS_LANG)
  console.log(`Found ${filtered.length} ${PROCESS_LANG} resources`)

  return filtered
}

/**
 * Generate HTML template
 */
function generateHtml(data: {
  title: string
  content: string
  source: string
  sourceUrl: string
  description?: string
}): string {
  const { title, content, source, sourceUrl, description } = data

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || '')}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
      font-size: 16px; line-height: 1.7; color: #333;
      background: #f8f8f8; padding: 16px;
    }
    .source-note {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff; padding: 12px 16px; border-radius: 8px;
      margin-bottom: 20px; font-size: 14px;
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    }
    .source-note a { color: #fff; text-decoration: underline; word-break: break-all; }
    .content {
      background: #fff; border-radius: 12px; padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .content h1 { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
    .content h2 { font-size: 20px; font-weight: 600; margin: 24px 0 12px; }
    .content p { margin-bottom: 12px; }
    .content a { color: #667eea; }
    .content img { max-width: 100%; height: auto; border-radius: 8px; }
    .content pre { background: #f5f5f5; padding: 12px; border-radius: 8px; overflow-x: auto; }
    .content code { font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="source-note">
    <span><strong>转载出处：</strong>${escapeHtml(source)}</span>
    <a href="${escapeHtml(sourceUrl)}" target="_blank">原文链接</a>
  </div>
  <div class="content">
    ${content}
  </div>
</body>
</html>`
}

/**
 * Extract thumbnail (og:image or favicon)
 */
async function extractThumbnail(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const html = await response.text()

    // Match og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/
    )
    if (ogImageMatch) return ogImageMatch[1]

    // Try alternate format
    const contentMatch = html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/
    )
    if (contentMatch) return contentMatch[1]

    return null
  } catch {
    return null
  }
}

/**
 * Fetch URL content and convert to simple HTML
 */
async function fetchContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Simple HTML to basic HTML (just keep some structure)
    let content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '<h1>$1</h1>')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '<h2>$1</h2>')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '<h3>$1</h3>')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '<p>$1</p>')
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '<a href="$1">$2</a>')
      .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '<img src="$1" alt="image">')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '<li>$1</li>')
      .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
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

  if (!shouldProcess(id, resource.url)) {
    console.log(`  → Skipping (already processed)`)
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

    // Generate HTML
    const html = generateHtml({
      title: resource.title,
      content: content || `<p>${resource.desc}</p>`,
      source: resource.source,
      sourceUrl: resource.url,
      description: resource.desc,
    })

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

  for (const resource of resources) {
    const id = generateId(resource.url)

    if (!shouldProcess(id, resource.url)) {
      skipped++
      continue
    }

    await processResource(resource)
    processed++

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\n' + '='.repeat(50))
  console.log('Summary:')
  console.log(`  Processed: ${processed}`)
  console.log(`  Skipped: ${skipped}`)
  console.log('='.repeat(50))
}

main().catch(console.error)
