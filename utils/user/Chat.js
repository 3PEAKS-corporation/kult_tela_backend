const { db, utils } = require('../../services/')
const { SOCKETS_CHAT } = require('../../sockets/models/')

const Chat = {
  async initRoomWithMessage(
    { fromUserId, toUserId, text },
    returnMessageId = true
  ) {
    const uids = fromUserId + ',' + toUserId
    const query = `INSERT INTO chat_rooms(user_ids)VALUES (ARRAY[${uids}]);
                  INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${uids}]), '${text}') RETURNING id`
    try {
      const data = await db.query(query)
      return returnMessageId === true ? data[1].rows[0].id : true
    } catch (error) {
      return null
    }
  },
  async addMessage({ fromUserId, toUserId, text }, returnMessageId = true) {
    const query = `INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[$1::int[]]), $2) RETURNING id`

    const values = [[fromUserId, toUserId], text]

    try {
      const data = await db.query(query, values)
      return returnMessageId === true ? data.rows[0].id : true
    } catch (error) {
      return null
    }
  },
  async getAllByUserId(userId) {
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

        query = `SELECT id, first_name || ' ' || last_name as name, rank, avatar_src  FROM users WHERE id=ANY(ARRAY[$1::int[]])`
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

        const chat_ids = chats.map(chat => chat.id)

        query = `WITH ids as (SELECT  MAX(id) as id, room_id
              FROM chat_messages
              WHERE room_id = ANY(ARRAY[$1::int[]])
              GROUP BY room_id )
              SELECT * FROM chat_messages_formatted() WHERE id= ANY(ARRAY(SELECT id FROM ids))`
        values = [chat_ids]

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
}

module.exports = Chat
