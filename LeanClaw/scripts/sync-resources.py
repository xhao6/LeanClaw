#!/usr/bin/env python3
"""数据同步脚本 - 将 openclaw101 资源数据转换到 LeanClaw 格式"""

import re
import json
from pathlib import Path

# 读取源文件
source_file = Path(__file__).parent.parent / 'openclaw101/src/data/resources.ts'
content = source_file.read_text(encoding='utf-8')

# 类型映射
category_to_type = {
    'official': 'resource',
    'getting-started': 'resource',
    'channel-integration': 'resource',
    'video': 'resource',
    'deep-dive': 'resource',
    'tools': 'resource',
    'cloud-deploy': 'resource',
    'use-cases': 'case',
    'skill-dev': 'skill'
}

# 解析资源
def parse_resources(text):
    resources = []
    # 匹配每个资源对象
    pattern = r'\{\s*title:\s*["\']([^"\']+)["\']\s*,\s*desc:\s*["\']([^"\']*)["\']\s*,\s*url:\s*["\']([^"\']*)["\']\s*,\s*source:\s*["\']([^"\']*)["\']'
    matches = re.findall(pattern, text)

    for match in matches:
        title, desc, url, source = match

        # 查找 category
        title_pos = text.find(f'title: \'{title}\'')
        if title_pos == -1:
            continue

        # 查找最近的 category
        search_start = max(0, title_pos - 500)
        search_end = title_pos + 100
        search_text = text[search_start:search_end]

        cat_match = re.search(r"category:\s*'([^']+)'", search_text)
        if not cat_match:
            continue

        category = cat_match.group(1)
        resource_type = category_to_type.get(category)
        if not resource_type:
            continue

        # 查找 tags
        tags_match = re.search(r"tags:\s*\[([^\]]+)\]", search_text)
        tags = []
        if tags_match:
            tags_str = tags_match.group(1)
            tags = re.findall(r"['\"]([^'\"]+)['\"]", tags_str)

        # 查找 featured
        featured_match = re.search(r'featured:\s*(true|false)', search_text)
        featured = featured_match.group(1) == 'true' if featured_match else False

        resources.append({
            'title': title,
            'desc': desc,
            'url': url,
            'source': source,
            'category': category,
            'type': resource_type,
            'tags': tags,
            'featured': featured
        })

    return resources

# 生成 ID
id_counters = {'resource': 0, 'case': 0, 'skill': 0}

def generate_id(resource_type):
    id_counters[resource_type] += 1
    prefixes = {'resource': 'res', 'case': 'case', 'skill': 'skill'}
    return f"{prefixes[resource_type]}-{id_counters[resource_type]:03d}"

# 获取占位图
def get_placeholder(category):
    placeholders = {
        'official': '/static/images/placeholder/article.svg',
        'getting-started': '/static/images/placeholder/article.svg',
        'channel-integration': '/static/images/placeholder/article.svg',
        'video': '/static/images/placeholder/video.svg',
        'deep-dive': '/static/images/placeholder/article.svg',
        'tools': '/static/images/placeholder/article.svg',
        'cloud-deploy': '/static/images/placeholder/article.svg',
        'use-cases': '/static/images/placeholder/case.svg',
        'skill-dev': '/static/images/placeholder/skill.svg'
    }
    return placeholders.get(category, '/static/images/placeholder/article.svg')

# 转换数据
print('Parsing openclaw101 resources...')
raw_resources = parse_resources(content)
print(f'Found {len(raw_resources)} raw resources')

# 去重并转换
seen = set()
transformed = []

for res in raw_resources:
    key = (res['title'], res['type'])
    if key in seen:
        continue
    seen.add(key)

    item = {
        'id': generate_id(res['type']),
        'title': res['title'],
        'desc': res['desc'],
        'type': res['type'],
        'tags': res['tags'],
        'url': res['url'],
        'category': res['category'],
        'source': res['source'],
        'featured': res['featured'],
    }

    if res['type'] == 'skill':
        item['stars'] = ''
        item['image'] = '/static/images/placeholder/skill.svg'
    else:
        item['image'] = get_placeholder(res['category'])

    transformed.append(item)

print(f'Transformed to {len(transformed)} unique items')

# 统计
by_type = {'resource': 0, 'case': 0, 'skill': 0}
for r in transformed:
    by_type[r['type']] += 1

print(f'  - Resource: {by_type["resource"]}')
print(f'  - Case: {by_type["case"]}')
print(f'  - Skill: {by_type["skill"]}')

# 生成 TypeScript 文件
ts_lines = []
ts_lines.append('// Mock data for the app')
ts_lines.append('// Synced from openclaw101 project')
ts_lines.append('')
ts_lines.append('export interface ResourceItem {')
ts_lines.append('  id: string;')
ts_lines.append('  title: string;')
ts_lines.append('  desc: string;')
ts_lines.append('  image?: string;')
ts_lines.append('  tags: string[];')
ts_lines.append("  type: 'resource' | 'case' | 'skill';")
ts_lines.append('  url?: string;')
ts_lines.append('  stars?: string;')
ts_lines.append('  category?: string;')
ts_lines.append('  source?: string;')
ts_lines.append('  featured?: boolean;')
ts_lines.append('}')
ts_lines.append('')
ts_lines.append('export const resources: ResourceItem[] = [')

for res in transformed:
    ts_lines.append(f"  // {res['category']} - {res['type']}")
    ts_lines.append('  {')
    ts_lines.append(f"    id: '{res['id']}',")
    # 转义单引号
    title = res['title'].replace("'", "\\'")
    desc = res['desc'].replace("'", "\\'")
    ts_lines.append(f"    title: '{title}',")
    ts_lines.append(f"    desc: '{desc}',")
    if res.get('image'):
        ts_lines.append(f"    image: '{res['image']}',")
    ts_lines.append(f"    type: '{res['type']}',")
    ts_lines.append(f"    tags: {json.dumps(res['tags'])},")
    if res.get('url'):
        ts_lines.append(f"    url: '{res['url']}',")
    if res.get('stars'):
        ts_lines.append(f"    stars: '{res['stars']}',")
    if res.get('category'):
        ts_lines.append(f"    category: '{res['category']}',")
    if res.get('source'):
        ts_lines.append(f"    source: '{res['source']}',")
    if res.get('featured'):
        ts_lines.append('    featured: true,')
    ts_lines.append('  },')
    ts_lines.append('')

ts_lines.append('];')

# 写入文件
output_path = Path(__file__).parent.parent / 'LeanClaw/src/data/mock.ts'
output_path.write_text('\n'.join(ts_lines), encoding='utf-8')
print(f'\nGenerated: {output_path}')
