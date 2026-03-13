import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read manifest
const manifestPath = join(__dirname, '..', '..', 'content', 'manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))

// Filter done resources and map to database format
const dbData = Object.values(manifest.resources)
  .filter((r: any) => r.status === 'done')
  .map((r: any) => {
    const url = r.sourceUrl

    // Generate ID from URL
    const id = url
      .replace(/https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 50)

    // Extract category
    let category = 'resource'
    const urlLower = url.toLowerCase()
    if (urlLower.includes('bilibili.com') || urlLower.includes('youtube.com')) {
      category = 'video'
    } else if (urlLower.includes('github.com')) {
      category = 'tool'
    } else if (r.category === 'cloud-deploy' || urlLower.includes('aliyun.com') || urlLower.includes('tencent.com') || urlLower.includes('aws.amazon.com')) {
      category = 'case'
    } else if (r.category === 'getting-started') {
      category = 'resource'
    }

    return {
      id,
      url,
      title: r.title,
      desc: '',
      source: r.source || new URL(url).hostname.replace('www.', ''),
      tags: r.category ? [r.category] : [],
      type: category,
      featured: r.featured || false,
      heat: 0
    }
  })

console.log('\n--- Ready to import to database ---\n')
console.log(JSON.stringify(dbData, null, 2))
console.log(`\nTotal: ${dbData.length} records`)
