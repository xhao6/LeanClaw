// 收藏模块
// 使用 uni.setStorageSync / uni.getStorageSync 进行数据持久化

import { reactive, shallowRef } from 'vue'
import type { ResourceItem } from '@/types/resource'
import { toggleFavorite as apiToggleFavorite } from '@/api/modules/user'

// 响应式收藏状态追踪器
const favoriteIds = shallowRef<Set<string>>(new Set())
const favoritesVersion = reactive({ value: 0 })

// 初始化加载收藏 ID
const loadFavoriteIds = () => {
  const list = getFavorites()
  favoriteIds.value = new Set(list.map(item => item.id))
}

// 触发收藏状态更新
export const refreshFavoriteStatus = () => {
  loadFavoriteIds()
  favoritesVersion.value++
}

// 收藏项接口
export interface FavoriteItem {
  id: string;
  type: 'resource' | 'case' | 'skill';
  title: string;
  desc: string;
  url?: string;
  image?: string;
  tags: string[];
  stars?: string;
  addedAt: number;  // timestamp
}

// 存储 key
const STORAGE_KEY = 'favorites'

// 获取收藏列表
export const getFavorites = (): FavoriteItem[] => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    if (data && Array.isArray(data)) {
      return data as FavoriteItem[]
    }
  } catch (e) {
    console.error('获取收藏列表失败:', e)
  }
  return []
}

// 保存收藏列表
const saveFavorites = (favorites: FavoriteItem[]): void => {
  try {
    uni.setStorageSync(STORAGE_KEY, favorites)
  } catch (e) {
    console.error('保存收藏列表失败:', e)
  }
}

// 检查是否已收藏（响应式）
export const isFavorited = (id: string): boolean => {
  // 访问 favoritesVersion 以追踪依赖
  void favoritesVersion.value
  return favoriteIds.value.has(id)
}

// 初始化（在模块加载时执行）
if (typeof uni !== 'undefined') {
  loadFavoriteIds()
}

// 添加收藏
export const addFavorite = (item: ResourceItem): boolean => {
  // 检查是否已收藏
  if (isFavorited(item.id)) {
    return false
  }

  // Cloud Sync
  apiToggleFavorite(item.id, item.type, 'add').catch(e => console.warn('Cloud add fav failed', e))

  const favorites = getFavorites()

  const favoriteItem: FavoriteItem = {
    id: item.id,
    type: item.type,
    title: item.title,
    desc: item.desc,
    url: item.url,
    image: item.image,
    tags: item.tags,
    stars: item.stars,
    addedAt: Date.now()
  }

  favorites.unshift(favoriteItem)  // 添加到列表头部
  saveFavorites(favorites)
  // 触发响应式更新
  refreshFavoriteStatus()
  return true
}

// 移除收藏
export const removeFavorite = (id: string): boolean => {
  const favorites = getFavorites()
  const index = favorites.findIndex(item => item.id === id)

  if (index === -1) {
    return false
  }

  // Cloud Sync
  const item = favorites[index]
  apiToggleFavorite(id, item.type, 'remove').catch(e => console.warn('Cloud remove fav failed', e))

  favorites.splice(index, 1)
  saveFavorites(favorites)
  // 触发响应式更新
  refreshFavoriteStatus()
  return true
}

// 切换收藏状态
export const toggleFavorite = (item: ResourceItem): boolean => {
  if (isFavorited(item.id)) {
    return removeFavorite(item.id)
  } else {
    return addFavorite(item)
  }
}

// 获取收藏数量
export const getFavoritesCount = (): number => {
  return getFavorites().length
}

// 清空所有收藏
export const clearAllFavorites = (): void => {
  saveFavorites([])
  // 触发响应式更新
  refreshFavoriteStatus()
}

// 云端收藏数据接口（与云端返回一致）
interface CloudFavoriteItem {
  _id?: string;
  resourceId: string;
  resourceType?: string;
  createdAt?: any;
}

// 从云端同步收藏数据
// 合并本地和云端数据（取并集），保留两边都有的收藏
export const syncFavorites = (cloudData: CloudFavoriteItem[]): void => {
  const localFavorites = getFavorites()
  const cloudIds = new Set(cloudData.map(item => item.resourceId))

  // 构建云端收藏 Map
  const cloudMap = new Map(cloudData.map(item => [item.resourceId, item]))

  // 合并：云端有则用云端，本地有则保留
  const merged: FavoriteItem[] = []

  // 先处理云端数据
  cloudData.forEach(item => {
    const localItem = localFavorites.find(f => f.id === item.resourceId)
    merged.push({
      id: item.resourceId,
      type: (item.resourceType as 'resource' | 'case' | 'skill') || 'resource',
      // 保留本地详情（如果有）
      title: localItem?.title || '',
      desc: localItem?.desc || '',
      url: localItem?.url,
      image: localItem?.image,
      tags: localItem?.tags || [],
      stars: localItem?.stars,
      addedAt: item.createdAt ? new Date(item.createdAt).getTime() : (localItem?.addedAt || Date.now())
    })
  })

  // 再添加本地独有的（云端没有的）
  localFavorites.forEach(item => {
    if (!cloudIds.has(item.id)) {
      merged.push(item)
    }
  })

  saveFavorites(merged)
  // 触发响应式更新
  refreshFavoriteStatus()
}
