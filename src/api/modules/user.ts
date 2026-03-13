import { callFunction } from '../core/cloud'

/**
 * User Login
 * Uses wx.login internally (optional, as CloudBase automatically handles OpenID)
 * But calling 'userFunctions' ensures user record exists in DB
 */
export const login = async () => {
  try {
    const res = await callFunction('userFunctions', { type: 'login' })
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
 * @param resourceId Resource ID
 * @param resourceType Resource Type
 * @param action 'add' | 'remove' | 'toggle'
 */
export const toggleFavorite = async (resourceId: string, resourceType: string = 'resource', action: 'add' | 'remove' | 'toggle' = 'toggle') => {
  return callFunction('userFunctions', {
    type: 'toggleFavorite',
    resourceId,
    resourceType,
    action
  })
}

/**
 * Get Favorites
 */
export const getFavorites = async () => {
  return callFunction('userFunctions', { type: 'getFavorites' })
}
