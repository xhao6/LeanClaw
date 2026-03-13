import { describe, it, expect } from 'vitest'
import { lessons, getLessonById, getAllLessonIds } from '../lessons'

describe('lessons 课程数据', () => {
  it('应包含 7 天课程', () => {
    expect(lessons).toHaveLength(7)
  })

  it('每课应有必需字段', () => {
    lessons.forEach(lesson => {
      expect(lesson.id).toBeDefined()
      expect(lesson.day).toBeDefined()
      expect(lesson.title).toBeDefined()
      expect(lesson.content).toBeDefined()
    })
  })

  it('getLessonById 应返回正确课程', () => {
    const lesson = getLessonById('day-1')
    expect(lesson).toBeDefined()
    expect(lesson?.day).toBe(1)
  })

  it('getLessonById 应返回 undefined（不存在时）', () => {
    expect(getLessonById('invalid')).toBeUndefined()
  })

  it('课程 ID 格式应正确', () => {
    const ids = getAllLessonIds()
    ids.forEach((id, index) => {
      expect(id).toBe(`day-${index + 1}`)
    })
  })
})
