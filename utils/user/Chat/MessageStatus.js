const { db } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')

const MessageStatus = {
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
  }
}

module.exports = MessageStatus
