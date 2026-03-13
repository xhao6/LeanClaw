#!/usr/bin/env python3
"""抓取资源 OG Image"""

import os
import re
import time
import hashlib
import requests
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# 配置
RESOURCES_FILE = 'src/data/mock.ts'
OUTPUT_DIR = 'static/images/resources'
THREADS = 5  # 并发数
TIMEOUT = 15  # 请求超时秒数
TARGET_SIZE = (200, 200)  # 目标尺寸

# 创建输出目录
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 静态图片域名白名单（不需要抓取）
PLACEHOLDER_DOMAINS = [
    'placeholder',
    'static/',
]

def get_urls_from_mock():
    """从 mock.ts 提取所有 URL"""
    urls = []
    with open(RESOURCES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 匹配 url: '...' 模式
    pattern = re.compile(r"url:\s*'([^']+)'")
    for match in pattern.finditer(content):
        url = match.group(1)
        urls.append(url)

    return urls

def sanitize_filename(url: str) -> str:
    """将 URL 转为安全的文件名"""
    # 使用 URL 的 hash 作为文件名，避免特殊字符问题
    hash_obj = hashlib.md5(url.encode())
    return hash_obj.hexdigest()[:12]

def fetch_html(url: str) -> str | None:
    """获取页面 HTML"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }
        resp = requests.get(url, headers=headers, timeout=TIMEOUT, allow_redirects=True)
        if resp.status_code == 200:
            return resp.text
        return None
    except Exception as e:
        return None

def extract_og_image(html: str, original_url: str) -> str | None:
    """从 HTML 提取 OG Image URL"""
    if not html:
        return None

    try:
        soup = BeautifulSoup(html, 'html.parser')

        # 优先尝试 og:image
        og_image = soup.find('meta', property='og:image')
        if og_image:
            img_url = og_image.get('content')
            if img_url:
                # 相对路径转为绝对路径
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                elif img_url.startswith('/'):
                    from urllib.parse import urlparse, urljoin
                    parsed = urlparse(original_url)
                    img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"
                return img_url

        # 备用: twitter:image
        twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})
        if twitter_image:
            img_url = twitter_image.get('content')
            if img_url:
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                return img_url

        # 备用: 从 <link rel="image_src"> 获取
        link_image = soup.find('link', rel='image_src')
        if link_image:
            img_url = link_image.get('href')
            if img_url:
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                return img_url

        return None
    except Exception as e:
        return None

def resize_and_crop_to_square(img: Image.Image, target_size: tuple) -> Image.Image:
    """将图片裁剪为正方形，保持比例，允许上下留白"""
    width, height = img.size
    target_width, target_height = target_size

    # 计算缩放比例（取较小值以确保完整覆盖）
    scale = max(target_width / width, target_height / height)
    new_width = int(width * scale)
    new_height = int(height * scale)

    # 缩放图片
    img = img.resize((new_width, new_height), Image.LANCZOS)

    # 计算裁剪位置（居中）
    left = (new_width - target_width) // 2
    top = (new_height - target_height) // 2
    right = left + target_width
    bottom = top + target_height

    # 裁剪
    img = img.crop((left, top, right, bottom))

    return img

def download_and_convert(img_url: str, filename: str) -> str | None:
    """下载图片并转为 200x200 WebP，保持比例，居中裁剪"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
        resp = requests.get(img_url, headers=headers, timeout=TIMEOUT)
        if resp.status_code != 200:
            return None

        img = Image.open(BytesIO(resp.content)).convert('RGB')

        # 使用 cover 模式：居中裁剪为正方形，保持比例
        img = resize_and_crop_to_square(img, TARGET_SIZE)

        # 保存为 WebP
        filepath = os.path.join(OUTPUT_DIR, f"{filename}.webp")
        img.save(filepath, 'WEBP', quality=80)

        return f"/static/images/resources/{filename}.webp"
    except Exception as e:
        print(f"  [Error] converting {img_url}: {e}")
        return None

def process_url(url: str) -> tuple[str, str | None]:
    """处理单个 URL，返回 (url, local_image_path)"""
    # 跳过静态资源
    for domain in PLACEHOLDER_DOMAINS:
        if domain in url:
            return (url, None)

    # 获取 HTML
    html = fetch_html(url)
    if not html:
        return (url, None)

    # 提取 OG Image
    img_url = extract_og_image(html, url)
    if not img_url:
        return (url, None)

    # 下载并转换
    filename = sanitize_filename(url)
    local_path = download_and_convert(img_url, filename)

    return (url, local_path)

def main():
    print("=" * 50)
    print("OG Image 抓取工具")
    print("=" * 50)

    # 获取所有 URL
    urls = get_urls_from_mock()
    print(f"找到 {len(urls)} 个资源 URL")

    results = {}
    success_count = 0
    failed_count = 0

    # 并发抓取
    print(f"\n开始抓取（并发数: {THREADS}）...")

    with ThreadPoolExecutor(max_workers=THREADS) as executor:
        futures = {executor.submit(process_url, url): url for url in urls}

        for future in tqdm(as_completed(futures), total=len(urls), desc="处理中"):
            url, local_path = future.result()
            results[url] = local_path
            if local_path:
                success_count += 1
            else:
                failed_count += 1

    print(f"\n完成！成功: {success_count}, 失败: {failed_count}")

    # 输出映射表（用于更新 mock.ts）
    print("\n生成图片映射...")
    mapping = {}
    for url, path in results.items():
        if path:
            # 提取 URL 的 id（简化处理，使用 hash）
            file_id = sanitize_filename(url)
            mapping[file_id] = path

    # 保存映射到文件
    with open('scripts/image_mapping.py', 'w', encoding='utf-8') as f:
        f.write("# URL hash -> 本地图片路径映射\n")
        f.write("IMAGE_MAPPING = {\n")
        for url, path in results.items():
            if path:
                f.write(f"    # {url}\n")
                f.write(f'    "{sanitize_filename(url)}": "{path}",\n')
        f.write("}\n")

    print(f"映射已保存到 scripts/image_mapping.py")
    print(f"\n图片保存在: {OUTPUT_DIR}")
    print(f"共抓取 {success_count} 张图片")

if __name__ == '__main__':
    main()
