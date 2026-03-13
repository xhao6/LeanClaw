import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONTENT_DIR = join(__dirname, '..', '..')

export interface ThumbnailResult {
  type: 'og:image' | 'favicon' | 'default'
  url?: string
  localPath?: string
}

/**
 * Extract thumbnail URL from a webpage
 * Priority: og:image > favicon > default
 */
export async function extractThumbnail(
  url: string,
  resourceId: string
): Promise<ThumbnailResult> {
  const thumbnailsDir = join(CONTENT_DIR, 'content', 'thumbnails')

  // Check if already processed
  const existingThumbnail = join(thumbnailsDir, `${resourceId}.webp`)
  if (existsSync(existingThumbnail)) {
    return {
      type: 'og:image',
      localPath: existingThumbnail,
    }
  }

  try {
    // Try to get og:image from the page
    const ogImage = await fetchOgImage(url)
    if (ogImage) {
      return {
        type: 'og:image',
        url: ogImage,
      }
    }
  } catch (error) {
    console.log(`Failed to fetch og:image for ${url}:`, error)
  }

  // Fallback to favicon
  try {
    const faviconUrl = getFaviconUrl(url)
    return {
      type: 'favicon',
      url: faviconUrl,
    }
  } catch {
    // Use default
  }

  return {
    type: 'default',
  }
}

/**
 * Fetch a URL and extract og:image
 */
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    const html = await response.text()

    // Match og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/
    )
    if (ogImageMatch) return ogImageMatch[1]

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
 * Extract domain favicon URL
 */
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`
  } catch {
    return ''
  }
}

/**
 * Download and save thumbnail image
 */
export async function downloadThumbnail(
  url: string,
  resourceId: string
): Promise<string | null> {
  const thumbnailsDir = join(CONTENT_DIR, 'content', 'thumbnails')
  if (!existsSync(thumbnailsDir)) {
    mkdirSync(thumbnailsDir, { recursive: true })
  }

  const outputPath = join(thumbnailsDir, `${resourceId}.webp`)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.log(`Failed to download thumbnail: ${response.status}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    writeFileSync(outputPath, Buffer.from(buffer))

    return outputPath
  } catch (error) {
    console.log(`Error downloading thumbnail:`, error)
    return null
  }
}

/**
 * Get the default thumbnail path
 */
export function getDefaultThumbnail(): string {
  return join(CONTENT_DIR, 'content', 'thumbnails', 'default.webp')
}

/**
 * Check if default thumbnail exists, if not create a placeholder
 */
export async function ensureDefaultThumbnail(): Promise<string> {
  const defaultPath = getDefaultThumbnail()

  if (!existsSync(defaultPath)) {
    // Create a simple colored placeholder
    // For now, just return empty - in production would generate a default image
    console.log('Default thumbnail not found, will use color placeholder')
  }

  return defaultPath
}
