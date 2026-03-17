/**
 * Resource item type definition
 * 资源数据类型定义
 */
export interface ResourceItem {
  id: string;
  title: string;
  desc: string;
  image?: string;
  tags: string[];
  type: 'resource' | 'case' | 'skill';
  url?: string;
  /** 转换后的 Markdown 文件 URL（静态托管） */
  markdownUrl?: string;
  stars?: string;
  category?: string;
  source?: string;
  featured?: boolean;
  heat?: number;
}
