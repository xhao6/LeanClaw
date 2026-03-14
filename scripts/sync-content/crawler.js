import axios from 'axios'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

/**
 * 使用 axios + cheerio 爬取网页（主方案）
 */
async function crawlWithCheerio(url) {
  const response = await axios.get(url, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 30000
  })

  const $ = cheerio.load(response.data)

  // 移除脚本、样式、导航等无关内容
  $('script, style, nav, header, footer, aside').remove()

  // 提取正文内容（尝试多种选择器）
  const contentSelectors = [
    'article',
    'main',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    'body'
  ]

  let content = null
  for (const selector of contentSelectors) {
    const el = $(selector)
    if (el.length && el.text().trim().length > 500) {
      content = el
      break
    }
  }

  if (!content) {
    content = $('body')
  }

  return {
    html: content.html(),
    title: $('title').text() || $('h1').first().text(),
    url
  }
}

/**
 * 使用 Puppeteer 爬取网页（兜底方案）
 */
async function crawlWithPuppeteer(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

    // 等待内容加载
    await page.waitForSelector('article, main, .content, body', { timeout: 10000 })

    const html = await page.$eval('body', el => {
      // 移除无关元素
      const clone = el.cloneNode(true)
      clone.querySelectorAll('script, style, nav, header, footer, aside, .ad, .advertisement').forEach(e => e.remove())
      return clone.innerHTML
    })

    const title = await page.title()

    return { html, title, url }
  } finally {
    await browser.close()
  }
}

/**
 * 主入口：先尝试 cheerio，失败则用 puppeteer
 */
export async function crawlPage(url) {
  try {
    console.log(`[Crawler] 使用 axios + cheerio 爬取: ${url}`)
    return await crawlWithCheerio(url)
  } catch (error) {
    console.log(`[Crawler] axios 失败，尝试 Puppeteer: ${url}`)
    try {
      return await crawlWithPuppeteer(url)
    } catch (puppeteerError) {
      console.error(`[Crawler] Puppeteer 也失败: ${url}`, puppeteerError.message)
      throw new Error(`爬取失败: ${url}`)
    }
  }
}

/**
 * 提取页面中所有图片 URL
 */
export function extractImages(html, baseUrl) {
  const $ = cheerio.load(html)
  const images = []

  $('img').each((i, el) => {
    let src = $(el).attr('src') || $(el).attr('data-src')
    if (src) {
      // 处理相对路径
      if (src.startsWith('//')) {
        src = 'https:' + src
      } else if (src.startsWith('/')) {
        const urlObj = new URL(baseUrl)
        src = urlObj.origin + src
      }
      if (src.startsWith('http')) {
        images.push(src)
      }
    }
  })

  return [...new Set(images)] // 去重
}
