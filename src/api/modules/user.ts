import { callFunction } from '../core/cloud'

/**
 * User Login
 * Uses wx.login internally (optional, as CloudBase automatically handles OpenID)
 * But calling 'userFunctions' ensures user record exists in DB
 */
export const login = async (data?: { userInfo: any }) => {
  try {
    const res = await callFunction('userFunctions', {
      type: 'login',
      data
    })
    return res
  } catch (err) {
    console.error('Login failed', err)
    throw err
  }
}

/**
 * Get User Profile
 */
export const getProfile = async () => {
  return callFunction('userFunctions', { type: 'getProfile' })
}

/**
 * Update Learning Progress
 * @param lessonId Lesson ID (e.g., 'day-1')
 * @param status 'completed' | 'in-progress'
 */
export const updateProgress = async (lessonId: string, status: string = 'completed') => {
  return callFunction('userFunctions', {
    type: 'updateProgress',
    lessonId,
    status
  })
}

/**
 * Get User Progress
 */
export const getProgress = async () => {
  return callFunction('userFunctions', { type: 'getProgress' })
}

/**
 * Toggle Favorite
 * @param params.resourceId Resource ID
 * @param params.resourceType Resource Type
 * @param params.title Resource Title
 * @param params.desc Resource Description
 * @param params.url Resource URL
 * @param params.image Resource Image URL
 * @param params.tags Resource Tags
 * @param params.action 'add' | 'remove' | 'toggle'
 */
export const toggleFavorite = async (params: {
  resourceId: string
  resourceType?: string
  title?: string
  desc?: string
  url?: string
  image?: string
  tags?: string[]
  action?: 'add' | 'remove' | 'toggle'
}) => {
  return callFunction('userFunctions', {
    type: 'toggleFavorite',
    ...params
  })
}

/**
 * Get Favorites
 */
export const getFavorites = async () => {
  return callFunction('userFunctions', { type: 'getFavorites' })
}
