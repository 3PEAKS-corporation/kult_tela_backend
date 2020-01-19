const { db, utils } = require('../../services')

const Chat = {
  async getAll(req, res) {
    const userId = req.currentUser.id

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

        query = `SELECT avatar_src, id, first_name || ' ' || last_name as name FROM users WHERE id = ANY($1)`
        values = [user_ids]

        const { rows: users } = await db.query(query, values)

        const valid_uids = users.map(user => user.id)

        chats = chats
          .filter(chat => valid_uids.includes(chat.user_id))
          .map(chat => {
            const _user = users.filter(user => user.id === chat.user_id)[0]
            _user.avatar_src = req.imageURL(_user.avatar_src)
            return {
              ...chat,
              user: _user
            }
          })

        query = `SELECT *, to_char(date,'DD.MM.YYYY') as date_formatted FROM chat_messages WHERE room_id = ANY($1) ORDER BY date DESC LIMIT 1`
        values = [chats.map(chat => chat.id)]

        const { rows: last_messages } = await db.query(query, values)

        chats = chats.map(chat => {
          let last_message = last_messages.filter(
            item => item.room_id === chat.id
          )[0]
          last_message.date = last_message.date_formatted
          delete last_message.date_formatted

          return {
            ...chat,
            messages_unread: chat.last_seen_message_id
              ? last_message.id - chat.last_seen_message_id
              : 0,
            last_message
          }
        })

        return utils.response.success(res, chats)
      } else return utils.response.success(res, { chats: [] })
    } catch (error) {
      return utils.response.error(res, 'Ошибка загрузки сообщений')
    }
  }
}

module.exports = Chat
