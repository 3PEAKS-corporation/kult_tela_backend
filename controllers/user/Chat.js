const { db, utils } = require('../../services')
const {
  User: { Common }
} = require('../../utils/')
const { SOCKETS_CHAT } = require('../../sockets/models/')

const Chat = {
  async getById(req, res) {
    const { user_id } = req.params
    const currentUser = req.currentUser

    if (
      !user_id ||
      (isNaN(user_id) === true || parseInt(user_id) === currentUser.id)
    )
      return utils.response.error(res)

    let query = `SELECT * FROM chat_rooms WHERE user_ids @> ARRAY[${currentUser.id},${user_id}]`
    let values

    try {
      const { rows } = await db.query(query)
      if (rows.length !== 0) {
        const chat = rows[0]

        chat.user_id = chat.user_ids.filter(id => id !== currentUser.id)[0]
        delete chat.user_ids

        if (!chat.last_seen_message_id) delete chat.last_seen_message_id
        if (!chat.second_is_admin) {
          delete chat.second_is_admin
          const user = await Common.getPublicUserData(user_id)
          chat.user = user
        } else {
          // find admin in db
        }

        query = `SELECT * FROM chat_messages_formatted() as f WHERE f.room_id=$1 ORDER BY id`
        values = [chat.id]

        const { rows: messages } = await db.query(query, values)
        chat.messages = messages
        chat.messages_unread = chat.last_seen_message_id
          ? messages[messages.length - 1].id - chat.last_seen_message_id
          : 0
        console.log(SOCKETS_CHAT.data)

        chat.user_status = SOCKETS_CHAT.isUser({ id: chat.user_id })

        return utils.response.success(res, chat)
      } else {
        const user = await Common.getPublicUserData(user_id)
        if (user) {
          const info = {
            user,
            user_id: user.id,
            chat_is_empty: true
          }

          return utils.response.success(res, info)
        } else return utils.response.error(res, 'Пользователь не существует')
      }
    } catch (error) {
      return utils.response.error(res, 'Ошибка загрузки чата')
    }
  },
  async getAll(req, res) {
    const userId = req.currentUser.id
    const chats = await getAllByUserId(userId)

    if (chats || chats === []) return utils.response.success(res, chats)
    else if (chats === null)
      return utils.response.error(res, 'Ошибка загрузки сообщений')
  }
}

async function getAllByUserId(userId) {
  let query = `SELECT * FROM chat_rooms WHERE $1 = ANY (user_ids);`
  let values = [userId]
  try {
    let { rows: chats } = await db.query(query, values)
    if (chats.length !== 0) {
      chats = chats.map(chat => {
        const user_id = chat.user_ids.filter(id => id !== userId)[0]
        delete chat.user_ids
        if (!chat.second_is_admin) delete chat.second_is_admin
        if (!chat.last_seen_message_id) delete chat.last_seen_message_id

        return {
          user_id,
          ...chat
        }
      })

      const user_ids = chats.map(chat => chat.user_id)

      query = `SELECT id, first_name || ' ' || last_name as name, rank, avatar_src  FROM users WHERE id=ANY($1)`
      values = [user_ids]

      const { rows: users } = await db.query(query, values)

      const valid_uids = users.map(user => user.id)

      chats = chats
        .filter(chat => valid_uids.includes(chat.user_id))
        .map(chat => {
          const _user = users.filter(user => user.id === chat.user_id)[0]
          _user.avatar_src = utils.getImageUrl(_user.avatar_src)
          return {
            ...chat,
            user: _user
          }
        })

      query = `SELECT * FROM chat_messages_formatted() as f WHERE f.room_id = ANY($1) ORDER BY id DESC LIMIT 1`
      values = [chats.map(chat => chat.id)]

      const { rows: last_messages } = await db.query(query, values)

      chats = chats.map(chat => {
        let last_message = last_messages.filter(
          item => item.room_id === chat.id
        )[0]

        return {
          ...chat,
          user_status: SOCKETS_CHAT.isUser({ id: chat.user_id }),
          messages_unread: chat.last_seen_message_id
            ? last_message.id - chat.last_seen_message_id
            : 0,
          messages: [last_message]
        }
      })

      return chats
    } else return []
  } catch (e) {
    return null
  }
}

module.exports = Chat
