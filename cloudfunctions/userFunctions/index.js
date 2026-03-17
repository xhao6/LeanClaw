const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { type, data } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return { success: false, message: 'Missing OPENID' };
  }

  const usersCollection = db.collection('users');
  const progressCollection = db.collection('progress');
  const favoritesCollection = db.collection('favorites');

  try {
    switch (type) {
      // ---------------- User Login & Profile ----------------
      case 'login': {
        const { userInfo } = data || {};
        
        // Check if user exists
        const { data: existingUsers } = await usersCollection.where({ _openid: openid }).get();
        
        let userData;
        if (existingUsers.length > 0) {
          // Update existing user
          userData = existingUsers[0];
          await usersCollection.doc(userData._id).update({
            data: {
              lastLoginAt: db.serverDate(),
              ...(userInfo || {})
            }
          });
        } else {
          // Create new user
          const res = await usersCollection.add({
            data: {
              _openid: openid,
              createdAt: db.serverDate(),
              lastLoginAt: db.serverDate(),
              role: 'user',
              ...(userInfo || {})
            }
          });
          userData = { _id: res._id, _openid: openid, ...userInfo };
        }
        
        return { success: true, data: userData };
      }

      case 'getProfile': {
        const { data: users } = await usersCollection.where({ _openid: openid }).get();
        if (users.length > 0) {
          return { success: true, data: { user: users[0] } };
        }
        return { success: false, message: 'User not found' };
      }

      // ---------------- Learning Progress ----------------
      case 'updateProgress': {
        // Support both data object and top-level params
        const params = data || event;
        const { lessonId, status } = params;
        if (!lessonId) return { success: false, message: 'Missing lessonId' };

        const { data: progress } = await progressCollection.where({ 
          _openid: openid,
          lessonId 
        }).get();

        if (progress.length > 0) {
          await progressCollection.doc(progress[0]._id).update({
            data: { status, updatedAt: db.serverDate() }
          });
        } else {
          await progressCollection.add({
            data: {
              _openid: openid,
              lessonId,
              status,
              createdAt: db.serverDate(),
              updatedAt: db.serverDate()
            }
          });
        }
        return { success: true };
      }

      case 'getProgress': {
        const { data: list } = await progressCollection.where({ _openid: openid }).get();
        return { success: true, data: { list } };
      }

      // ---------------- Favorites System ----------------
      case 'toggleFavorite': {
        // Support both data object and top-level params
        const params = data || event;
        const {
          resourceId,
          resourceType,
          title,
          desc,
          url,
          image,
          tags,
          action
        } = params; // action: 'add', 'remove', 'toggle'
        if (!resourceId) return { success: false, message: 'Missing resourceId' };

        const { data: existing } = await favoritesCollection.where({
          _openid: openid,
          resourceId
        }).get();

        let isFavorited = false;

        const doAdd = async () => {
          await favoritesCollection.add({
            data: {
              _openid: openid,
              resourceId,
              resourceType: resourceType || 'resource',
              title: title || '',
              desc: desc || '',
              url: url || '',
              image: image || '',
              tags: tags || [],
              createdAt: db.serverDate()
            }
          });
          return true;
        };

        const doRemove = async (id) => {
          await favoritesCollection.doc(id).remove();
          return false;
        };

        if (action === 'add') {
          if (existing.length === 0) {
            isFavorited = await doAdd();
          } else {
            isFavorited = true;
          }
        } else if (action === 'remove') {
          if (existing.length > 0) {
            isFavorited = await doRemove(existing[0]._id);
          } else {
            isFavorited = false;
          }
        } else {
          // Default: toggle
          if (existing.length > 0) {
            isFavorited = await doRemove(existing[0]._id);
          } else {
            isFavorited = await doAdd();
          }
        }
        
        return { success: true, data: { isFavorited } };
      }

      case 'getFavorites': {
        const { data: list } = await favoritesCollection.where({ _openid: openid }).get();
        // Ideally we should join with resources collection here,
        // but for simple NoSQL, client can fetch details or we do it here
        return { success: true, data: list };
      }

      case 'updateProfile': {
        const { name, avatar } = data

        if (!openid) {
          return { success: false, message: '无法获取用户信息' }
        }

        try {
          const userRes = await usersCollection.where({
            _openid: openid
          }).get()

          if (userRes.data && userRes.data.length > 0) {
            const userId = userRes.data[0]._id
            const updateData = {}
            if (name !== undefined) updateData.name = name
            if (avatar !== undefined) updateData.avatar = avatar

            await usersCollection.doc(userId).update({
              data: updateData
            })

            return { success: true, message: '更新成功' }
          } else {
            return { success: false, message: '用户不存在' }
          }
        } catch (err) {
          console.error('Update profile failed', err)
          return { success: false, message: '更新失败' }
        }
      }

      default:
        return { success: false, message: `Unknown action type: ${type}` };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};
