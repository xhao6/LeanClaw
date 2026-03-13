#!/usr/bin/env python3
"""将图片映射更新到 mock.ts"""

import re
import hashlib
import os

# 读取图片目录
OUTPUT_DIR = 'static/images/resources'
images = os.listdir(OUTPUT_DIR)
image_basenames = [os.path.splitext(f)[0] for f in images if f.endswith('.webp')]

print(f"找到 {len(image_basenames)} 张图片")

# 读取 mock.ts
with open('src/data/mock.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 读取 image_mapping.py 获取 URL -> hash 映射
IMAGE_MAPPING = {}
with open('scripts/image_mapping.py', 'r', encoding='utf-8') as f:
    mapping_text = f.read()

# 解析映射
for line in mapping_text.split('\n'):
    if line.startswith('    # '):
        url = line[5:]
    elif '"' in line and ': "' in line:
        match = re.search(r'"([^"]+)":\s*"([^"]+)"', line)
        if match:
            hash_val = match.group(1)
            path = match.group(2)
            IMAGE_MAPPING[hash_val] = path

print(f"映射表有 {len(IMAGE_MAPPING)} 条记录")

# 逐行处理，更新 image 字段
lines = content.split('\n')
new_lines = []
updated_count = 0

for line in lines:
    # 检查是否是 url 行
    if "url:" in line:
        url_match = re.search(r"url:\s*'([^']+)'", line)
        if url_match:
            url = url_match.group(1)
            # 计算 hash
            hash_val = hashlib.md5(url.encode()).hexdigest()[:12]
            # 查找对应图片
            if hash_val in IMAGE_MAPPING:
                # 找到对应的 image 行（在 url 之前的 image 字段）
                # 需要在前面找 image 字段
                pass

    # 检查是否是 image 行
    if "image:" in line:
        # 看看前面的 url 是什么
        # 这里比较复杂，让我们用另一种方式
        new_lines.append(line)
        continue

    new_lines.append(line)

# 重新处理：按资源对象处理
# 找到每个资源的 url 和 image
resources = re.findall(
    r"(\{[^}]*image:[^}]*url:[^}]*\})",
    content,
    re.DOTALL
)

print(f"找到 {len(resources)} 个资源")

# 简单方法：直接替换所有 image 字段
# 由于顺序没变，我们按顺序替换
# 找出所有 image 字段的位置，按顺序替换

# 先创建一个 URL 顺序列表
url_hashes = []
url_pattern = re.compile(r"url:\s*'([^']+)'")
for url_match in url_pattern.finditer(content):
    url = url_match.group(1)
    hash_val = hashlib.md5(url.encode()).hexdigest()[:12]
    url_hashes.append(hash_val)

print(f"URL hash 列表有 {len(url_hashes)} 条")

# 替换 image 字段
# 策略：找到所有 image: '...' 行，按顺序用映射替换
image_pattern = re.compile(r"(image:\s*)'[^']*'(,\s*)")

# 找到所有匹配
matches = list(image_pattern.finditer(content))

print(f"找到 {len(matches)} 个 image 字段")

# 替换
new_content = content
offset = 0
for i, match in enumerate(matches):
    if i < len(url_hashes):
        hash_val = url_hashes[i]
        if hash_val in IMAGE_MAPPING:
            old_str = match.group(0)
            new_str = f"{match.group(1)}'{IMAGE_MAPPING[hash_val]}'{match.group(2)}"
            # 需要计算偏移
            pos = match.start() + offset
            new_content = new_content[:pos] + new_str + new_content[pos + len(old_str):]
            offset += len(new_str) - len(old_str)
            updated_count += 1

print(f"更新了 {updated_count} 个 image 字段")

# 写回文件
with open('src/data/mock.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("已更新 src/data/mock.ts")
