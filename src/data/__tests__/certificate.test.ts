import { describe, it, expect } from 'vitest'
import { createCertificate, certificateInfo, type Certificate } from '../certificate'

describe('certificate 证书数据', () => {
  describe('createCertificate', () => {
    it('应创建包含默认持有人名称的证书', () => {
      const cert = createCertificate()
      expect(cert.title).toBe(certificateInfo.title)
      expect(cert.subtitle).toBe(certificateInfo.subtitle)
      expect(cert.desc).toBe(certificateInfo.desc)
      expect(cert.holderName).toBe('龙虾驯养员')
      expect(cert.issuedDate).toMatch(/\d{4}年\d{1,2}月\d{1,2}日/)
    })

    it('应创建包含自定义持有人名称的证书', () => {
      const cert = createCertificate('测试用户')
      expect(cert.holderName).toBe('测试用户')
    })

    it('无昵称时应使用默认名称', () => {
      const cert = createCertificate('')
      expect(cert.holderName).toBe('龙虾驯养员')
    })

    it('应生成正确的颁发日期格式', () => {
      const cert = createCertificate()
      const date = new Date()
      const expectedYear = date.getFullYear()
      const expectedMonth = String(date.getMonth() + 1).padStart(2, '0')
      const expectedDay = String(date.getDate()).padStart(2, '0')
      expect(cert.issuedDate).toBe(`${expectedYear}年${expectedMonth}月${expectedDay}日`)
    })
  })

  describe('certificateInfo', () => {
    it('应包含正确的证书信息', () => {
      expect(certificateInfo.title).toBe('龙虾驯养师')
      expect(certificateInfo.subtitle).toBe('OpenClaw 学习成就')
      expect(certificateInfo.desc).toContain('OpenClaw')
    })
  })
})
