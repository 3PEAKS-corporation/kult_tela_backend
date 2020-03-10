const { db, utils } = require('../../services')
const { User } = require('../../utils/')
const { SOCKETS_CHAT } = require('../../sockets/models/')
const { copyDATA } = require('../../data/')
const fs = require('fs')
const path = require('path')

const Chat = {
  async getById(req, res) {
    const user_id = parseInt(req.params.user_id)
    const currentUser = req.currentUser
    const isConversation = (req.query.c == 'true' && true) || false

    if (typeof user_id !== 'number' || user_id === currentUser.id)
      return utils.response.error(res, 'Чат не существует!')

    let meta = { all: false }
    if (!isConversation) {
      meta = {
        currentUserId: currentUser.id,
        all: false,
        userId: user_id
      }
    } else {
      meta = {
        conversation: {
          id: user_id
        }
      }
    }

    const chat = await User.Chat.Room.get(meta)
    if (chat && chat.length > 0) return utils.response.success(res, chat[0])
    else return utils.response.error(res, 'Чат не существует!')
  },
  async getAll(req, res) {
    const userId = req.currentUser.id
    const chats = await User.Chat.Room.get({
      currentUserId: userId,
      all: true
    })

    if (chats || chats === []) return utils.response.success(res, chats)
    else if (chats === null)
      return utils.response.error(res, 'Ошибка загрузки сообщений')
  },
  async uploadImage(req, res) {
    const toUserId = parseInt(req.body.to_user_id)
    const fromUserId = parseInt(req.currentUser.id)

    if (!req.file || typeof toUserId !== 'number')
      return utils.response.error(res)

    const image = req.file

    try {
      let access = false
      if (typeof req.currentUser.admin_role_id === 'number') access = true
      else {
        const status = await isUploadAllowed(fromUserId, toUserId)

        if (!status.access) {
          access = false
          fs.unlink(
            process.cwd() + '/public/images/' + image.filename,
            function(err) {
              if (err) throw 'err'
            }
          )
          return utils.response.error(
            res,
            status.limit
              ? 'Превышен лимит загружаемых изображений'
              : 'Невозможно загрузить изображение'
          )
        } else if (status.access === true) access = true
      }

      return utils.response.success(res, { src: image.filename })
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'Невозможно загрузить изображение')
    }
  }
}

async function isUploadAllowed(fromUserId, toUserId) {
  const query = `SELECT COUNT(*) as count FROM chat_messages WHERE (arr_length(attachments)) > 0 AND user_id=${fromUserId};
    SELECT admin_role_id FROM users WHERE id=${toUserId};
    `
  const data = await db.query(query)

  const count =
    data[0] && data[0].rows[0] ? parseInt(data[0].rows[0].count) : null
  const adminRoleId =
    data[1] && data[1].rows[0] ? parseInt(data[1].rows[0].admin_role_id) : null

  console.log('role', typeof adminRoleId)

  if (typeof adminRoleId !== 'number' || isNaN(adminRoleId)) {
    return { access: false }
  }
  if (typeof count !== 'number' || count > 9)
    return { access: false, limit: true }

  return { access: true }
}

module.exports = Chat
