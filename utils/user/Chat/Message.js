const { db, utils } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')
const Protection = require('./Protection')

const formatChatText = text => {
  return text
    .trim()
    .replace(/<br\s*\/*>/gi, '\n')
    .replace(/(<(p|div))/gi, '\n$1')
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\n\s*\n/g, '\n\n')
}

const Messages = {
  async initRoomWithMessage(
    { fromUserId, toUserId, text },
    returnMessageId = true
  ) {
    fromUserId = parseInt(fromUserId)
    toUserId = parseInt(toUserId)
    if (typeof fromUserId !== 'number' || typeof toUserId !== 'number')
      return false

    const chatAllowed = await Protection.isMessageAllowed(fromUserId, toUserId)
    if (!chatAllowed) return false

    const uids = fromUserId + ',' + toUserId
    let query = `SELECT id, admin_role_id, plan_id FROM users WHERE id IN (${uids});`
    try {
      text = formatChatText(text)
      query = `INSERT INTO chat_rooms(user_ids)VALUES (ARRAY[${uids}]);
                  INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${uids}]), '${text}') RETURNING id`

      const data = await db.query(query)

      return returnMessageId === true ? data[1].rows[0].id : true
    } catch (error) {
      return null
    }
  },
  async addMessage({ fromUserId, toUserId, text }, returnMessageId = true) {
    const isAllowed = await Protection.isMessageAllowed(fromUserId, toUserId)
    if (!isAllowed) return false

    text = formatChatText(text)
    const query = `INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[$1::int[]]), $2) RETURNING id`

    const values = [[fromUserId, toUserId], text]

    try {
      const data = await db.query(query, values)
      return returnMessageId === true ? data.rows[0].id : true
    } catch (error) {
      return null
    }
  }
}

module.exports = Messages
