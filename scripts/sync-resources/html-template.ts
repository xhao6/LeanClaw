export interface HtmlTemplateData {
  title: string
  content: string
  source: string
  sourceUrl: string
  description?: string
}

export function generateHtml(data: HtmlTemplateData): string {
  const { title, content, source, sourceUrl, description } = data

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || '')}">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      color: #333;
      background-color: #f8f8f8;
      padding: 16px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .source-note {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    .source-note .label {
      font-weight: 600;
      margin-right: 8px;
    }

    .source-note a {
      color: #fff;
      text-decoration: underline;
      word-break: break-all;
    }

    .content {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .content h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1a1a1a;
      line-height: 1.4;
    }

    .content h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 24px 0 12px;
      color: #2a2a2a;
    }

    .content h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0 10px;
      color: #3a3a3a;
    }

    .content p {
      margin-bottom: 12px;
    }

    .content a {
      color: #667eea;
      text-decoration: none;
    }

    .content a:hover {
      text-decoration: underline;
    }

    .content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 12px 0;
      display: block;
    }

    .content ul, .content ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    .content li {
      margin-bottom: 8px;
    }

    .content pre {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 12px 0;
      font-size: 14px;
    }

    .content code {
      font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .content pre code {
      background: none;
      padding: 0;
    }

    .content blockquote {
      border-left: 4px solid #667eea;
      padding-left: 16px;
      margin: 12px 0;
      color: #666;
      background: #f9f9f9;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
    }

    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 14px;
    }

    .content th, .content td {
      border: 1px solid #eee;
      padding: 10px 12px;
      text-align: left;
    }

    .content th {
      background: #f5f5f5;
      font-weight: 600;
    }

    .content hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 20px 0;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
        color: #e0e0e0;
      }

      .content {
        background: #2a2a2a;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .content h1, .content h2, .content h3 {
        color: #e0e0e0;
      }

      .content a {
        color: #a5b4fc;
      }

      .content pre {
        background: #1a1a1a;
      }

      .content code {
        background: #3a3a3a;
      }

      .content blockquote {
        background: #2a2a2a;
        color: #aaa;
      }

      .content th, .content td {
        border-color: #444;
      }

      .content th {
        background: #333;
      }
    }
  </style>
</head>
<body>
  <div class="source-note">
    <span>
      <span class="label">转载出处：</span>${escapeHtml(source)}
    </span>
    <a href="${escapeHtml(sourceUrl)}" target="_blank">原文链接</a>
  </div>

  <div class="content">
    ${content}
  </div>
</body>
</html>`
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
