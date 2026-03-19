# 域名更改汇总

本文档汇总自定义域名配置后的所有修改。


## 已修改的文件

### 2. SKILL 文档

#### `scripts/content-sync-workflow/SKILL.md`
- 步骤 4：上传到云存储
- 云存储配置：
  - 存储桶：`6c65-leanmind-1gjtoa502716c21d-1410913126`
  - 资源目录：`/content/markdown`
- URL 格式：`https://6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la/content/markdown/<filename>.md`

#### `scripts/skills-sync-workflow/SKILL.md`
- 步骤 6：上传到云存储
- 云存储配置：
  - 存储桶：`6c65-leanmind-1gjtoa502716c21d-1410913126`
  - 资源目录：`/content/skills`
- URL 格式：`https://6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la/content/skills/<filename>.md`

## 云存储配置信息

- **存储桶**：`6c65-leanmind-1gjtoa502716c21d-1410913126`
- **CDN 域名**：`6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la`
- **资源目录**：
  - `/content/markdown` - 文章内容
  - `/content/skills` - Skills 文档
  - `/images` - 图片资源

## 待处理

1. **数据库记录更新**：已有记录使用旧域名，需要批量更新
2. **静态托管配置**：如需使用自定义域名访问静态网站，需在云存储控制台配置自定义域名

## 相关 Commit

| Commit | 描述 |
|--------|------|
| `204704a7` | fix: 更新云存储图片基础URL |
| `78329749` | docs: 更新工作流文档中的静态托管为云存储并添加配置 |

## 更新日志

- **2026-03-19**: 初始文档创建
