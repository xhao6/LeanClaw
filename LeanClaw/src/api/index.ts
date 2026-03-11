import { alovaInstance } from './core/instance'

// 学习路径相关 API
export const getLearnDays = () => alovaInstance.Get('/learn/days')
export const getDayDetail = (id: string) => alovaInstance.Get(`/learn/day/${id}`)

// 发现模块相关 API
export const getResources = (params: any) => alovaInstance.Get('/discover/resources', { params })
export const getCases = (params: any) => alovaInstance.Get('/discover/cases', { params })
export const getSkills = (params: any) => alovaInstance.Get('/discover/skills', { params })

// 用户相关 API
export const login = (data: any) => alovaInstance.Post('/user/login', data)
export const getProfile = () => alovaInstance.Get('/user/profile')
