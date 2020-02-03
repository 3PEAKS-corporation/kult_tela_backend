const { db, utils } = require('../../services')
const { User } = require('../../utils/')
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

        if (!chat.second_is_admin) {
          const user = await User.Common.getPublicUserData(user_id)
          chat.user = user
        } else {
          // find admin in db
        }

        query = `SELECT * FROM chat_messages_formatted WHERE room_id=$1 ORDER BY id DESC LIMIT 40`
        values = [chat.id]

        const { rows: messages } = await db.query(query, values)
        chat.messages = messages

        console.log(SOCKETS_CHAT.data)

        chat.user_status = SOCKETS_CHAT.isUser({ id: chat.user_id })
        chat.messages = chat.messages.reverse()

        return utils.response.success(res, chat)
      } else {
        const user = await User.Common.getPublicUserData(user_id)
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
    const chats = await User.Chat.Room.getAllByUserId(userId)

    if (chats || chats === []) return utils.response.success(res, chats)
    else if (chats === null)
      return utils.response.error(res, 'Ошибка загрузки сообщений')
  }
}

module.exports = Chat
