/**
 * Resource item type definition
 * 从 @/data/mock 抽取的类型，避免直接引用 mock 文件
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
