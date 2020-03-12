const { db } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')

const MessageUtils = {
  async setLastSeenId({ room_id, message_id, user_id }) {
    const query = `UPDATE chat_rooms SET last_seen_message_id=$1 WHERE id=$2 AND user_ids @> ARRAY[$3::int[]] RETURNING user_ids`
    const values = [message_id, room_id, [user_id]]

    try {
      const { rows } = await db.query(query, values)
      const user_ids = rows[0].user_ids
      if (user_ids) return user_ids
      else return false
    } catch (error) {
      return false
    }
  },
  async loadMessagesHistory({ room_id, from_message_id, user_id }) {
    const query = `SELECT * FROM chat_messages_formatted WHERE room_id=(SELECT id FROM chat_rooms WHERE id=$1 AND user_ids @> ARRAY[$2::int[]]) AND id<$3 ORDER BY id DESC LIMIT 40`
    const values = [room_id, [user_id], from_message_id]

    try {
      const { rows: messages } = await db.query(query, values)
      return messages.reverse()
    } catch (error) {
      return false
    }
  }
}

module.exports = MessageUtils
