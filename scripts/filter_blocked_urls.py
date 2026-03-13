#!/usr/bin/env python3
"""筛选中国无法访问的 URL"""

import re

# 不可访问的域名模式
BLOCKED_DOMAINS = [
    'github.com',
    'github.io',
    'reddit.com',
    'twitter.com',
    'x.com',
    'youtube.com',
    'youtu.be',
    'discord.com',
    'stackoverflow.com',
    'medium.com',
    'substack.com',
]

def is_blocked(url: str) -> bool:
    """检查 URL 是否包含不可访问的域名"""
    url_lower = url.lower()
    for domain in BLOCKED_DOMAINS:
        if domain in url_lower:
            return True
    return False

# 读取 mock.ts
with open('src/data/mock.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取所有资源条目
# 使用正则匹配每个资源对象
resource_pattern = re.compile(
    r"(\s*\{\s*id:\s*'[^']+',\s*title:\s*'[^']*',\s*desc:\s*'[^']*',\s*image:\s*'[^']*',\s*url:\s*'[^']+',\s*source:\s*'[^']*',\s*sourceIcon:\s*'[^']*',\s*lang:\s*'(?:zh|en)',\s*category:\s*'[^']+',\s*tags:\s*\[[^\]]*\]\s*,?\s*\})",
    re.MULTILINE
)

# 分割内容为头部+资源+尾部
# 找到 export const resources 开头
resources_start = content.find('export const resources')
header = content[:resources_start]

# 找到 resources 的结束位置（最后一个 }; 之后）
resources_section = content[resources_start:]

# 逐行处理
lines = content.split('\n')
filtered_lines = []
skipped_count = 0
kept_count = 0
i = 0

while i < len(lines):
    line = lines[i]

    # 检查是否是资源对象的 url 行
    if "url:" in line:
        # 提取完整 URL
        url_match = re.search(r"url:\s*'([^']+)'", line)
        if url_match:
            url = url_match.group(1)
            if is_blocked(url):
                # 跳过整个资源对象（找到对应的 { 开始）
                # 向前找到 {
                j = i
                while j >= 0 and '{' not in lines[j]:
                    j -= 1
                # 向后找到 } 结束
                k = i
                brace_count = 0
                started = False
                while k < len(lines):
                    if '{' in lines[k]:
                        brace_count += lines[k].count('{')
                        started = True
                    if '}' in lines[k]:
                        brace_count -= lines[k].count('}')
                    if started and brace_count == 0:
                        break
                    k += 1

                # 跳过这些行
                for skip_line in range(j, k + 1):
                    pass  # 不添加到 filtered_lines

                skipped_count += 1
                i = k + 1
                continue

    filtered_lines.append(line)
    i += 1

# 统计
print(f"筛选前: 342 个资源")
print(f"筛选后: {342 - skipped_count} 个资源")
print(f"跳过: {skipped_count} 个")

# 写回文件
with open('src/data/mock.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(filtered_lines))

print("已更新 src/data/mock.ts")
