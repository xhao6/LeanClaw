// 证书数据定义

export interface Certificate {
  title: string;        // "龙虾驯养师"
  subtitle: string;     // "OpenClaw 学习成就"
  desc: string;        // 证书描述
  issuedDate: string;  // 颁发日期
  holderName: string;  // 持有人（可选自定义）
}

// 证书信息
export const certificateInfo: Omit<Certificate, 'issuedDate' | 'holderName'> = {
  title: '龙虾驯养师',
  subtitle: 'OpenClaw 学习成就',
  desc: '本证书表明持有人已完成 OpenClaw 7天学习课程，掌握了部署、自动化等核心技能，是一名合格的龙虾驯养师。',
}

// 创建证书
export const createCertificate = (holderName: string = '龙虾驯养员'): Certificate => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return {
    ...certificateInfo,
    issuedDate: `${year}年${month}月${day}日`,
    holderName: holderName || '龙虾驯养员',
  }
}
