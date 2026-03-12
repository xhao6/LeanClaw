const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 模拟数据源，实际生产环境建议从 GitHub API 或其他 HTTP 接口拉取
// 这里为了简化，我们先定义一些基础数据结构，后续可以通过参数传入
const mockResources = [
  {
    id: '1',
    title: 'Getting Started — 官方入门指南',
    desc: '从零到第一次对话的最快路径',
    type: 'article',
    url: 'https://docs.openclaw.org/getting-started',
    tags: ['官方', '入门'],
    image: 'https://docs.openclaw.org/img/logo.png',
    heat: 999
  },
  {
    id: '2',
    title: 'OpenClaw — Wikipedia',
    desc: '维基百科词条，了解 OpenClaw 的历史和影响',
    type: 'article',
    url: 'https://en.wikipedia.org/wiki/OpenClaw',
    tags: ['百科', '历史'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg',
    heat: 888
  }
];

exports.main = async (event, context) => {
  const { data = mockResources } = event;
  const collection = db.collection('resources');
  
  const results = {
    total: data.length,
    success: 0,
    failed: 0,
    errors: []
  };

  for (const item of data) {
    try {
      // 检查是否存在
      const { data: existing } = await collection.where({
        title: item.title, // 假设标题唯一，或者应该用 URL/ID
        url: item.url
      }).get();

      if (existing.length > 0) {
        // 更新
        await collection.doc(existing[0]._id).update({
          data: {
            ...item,
            updatedAt: db.serverDate()
          }
        });
      } else {
        // 插入
        await collection.add({
          data: {
            ...item,
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        });
      }
      results.success++;
    } catch (err) {
      console.error('Sync error for item:', item.title, err);
      results.failed++;
      results.errors.push({ title: item.title, error: err.message });
    }
  }

  return {
    success: true,
    message: 'Sync completed',
    results
  };
};
