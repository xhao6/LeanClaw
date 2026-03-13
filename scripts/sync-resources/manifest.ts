import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CONTENT_DIR = join(__dirname, '..')

export interface ResourceManifest {
  lastSync: string
  resources: Record<string, ResourceManifestItem>
}

export interface ResourceManifestItem {
  status: 'pending' | 'processing' | 'done' | 'failed'
  title: string
  sourceUrl: string
  source?: string
  category?: string
  processedAt?: string
  error?: string
}

const MANIFEST_PATH = join(CONTENT_DIR, 'content', 'manifest.json')

export function readManifest(): ResourceManifest {
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

export function writeManifest(manifest: ResourceManifest): void {
  const dir = join(CONTENT_DIR, 'content')
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
}

export function updateResourceStatus(
  id: string,
  item: ResourceManifestItem
): void {
  const manifest = readManifest()
  manifest.resources[id] = item
  manifest.lastSync = new Date().toISOString()
  writeManifest(manifest)
}

export function getResourceStatus(id: string): ResourceManifestItem | undefined {
  const manifest = readManifest()
  return manifest.resources[id]
}

export function shouldProcess(id: string, currentUrl: string): boolean {
  const manifest = readManifest()
  const existing = manifest.resources[id]

  if (!existing) return true
  if (existing.status === 'failed') return true
  if (existing.sourceUrl !== currentUrl) return true

  return false
}
