# batchUpdate 云函数使用文档

## 功能

批量增量更新 NoSQL 数据库，支持：
- `addFields`: 批量添加/更新字段（使用 `$set` 增量更新，避免字段丢失）
- `removeFields`: 批量删除字段（使用 `$unset`）
- `replaceValue`: 批量替换字段值

## 调用方式

```javascript
wx.cloud.callFunction({
  name: 'batchUpdate',
  data: {
    action: 'addFields',
    collection: 'resources',
    query: { type: 'resource' },
    data: { createdAt: new Date() }
  }
})
```

## 参数说明

| 参数 | 必填 | 说明 |
|-----|------|------|
| action | 是 | 操作类型: addFields, removeFields, replaceValue |
| collection | 是 | 集合名称（必须在白名单中） |
| query | 否 | 筛选条件，默认为 `{}` |
| data | 否 | 要添加/更新的字段（addFields 使用） |
| field | 否 | 字段名（removeFields/replaceValue 使用） |
| oldValue | 否 | 旧值（replaceValue 使用） |
| newValue | 否 | 新值（replaceValue 使用） |

## 白名单集合

- resources
- favorites
- certificates
- users
- progress

## 操作示例

### addFields - 批量添加字段

```javascript
// 为所有 type=resource 的记录添加 testField
wx.cloud.callFunction({
  name: 'batchUpdate',
  data: {
    action: 'addFields',
    collection: 'resources',
    query: { type: 'resource' },
    data: {
      testField: 'test',
      // createdAt 会自动添加
    }
  }
})
```

### removeFields - 批量删除字段

```javascript
// 删除指定记录的某个字段
wx.cloud.callFunction({
  name: 'batchUpdate',
  data: {
    action: 'removeFields',
    collection: 'resources',
    query: { type: 'resource' },
    field: 'testField'
  }
})
```

### replaceValue - 批量替换字段值

```javascript
// 替换域名
wx.cloud.callFunction({
  name: 'batchUpdate',
  data: {
    action: 'replaceValue',
    collection: 'resources',
    query: { type: 'resource' },
    field: 'markdownUrl',
    oldValue: 'xxx.tcloudbaseapp.com',
    newValue: 'xxx.tcb.qcloud.la'
  }
})
```

## 返回格式

```json
{
  "success": true,
  "message": "成功更新 10 条记录",
  "data": {
    "updated": 10,
    // replaceValue 时
    "total": 15
  }
}
```

## 错误响应

```json
{
  "success": false,
  "message": "无权限执行批量操作"
}
```

## 注意事项

1. **增量更新**: addFields 使用 `$set` 操作符，不会丢失其他字段
2. **自动时间戳**: addFields 和 replaceValue 会自动添加/更新 `updatedAt` 字段
3. **权限控制**: 仅允许配置的管理员 openid 调用
4. **批量限制**: replaceValue 操作受限于云函数超时时间，大量数据建议分批执行
