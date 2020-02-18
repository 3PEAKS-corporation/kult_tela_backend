const { db, utils } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')

const formatChatText = text => {
  return text
    .trim()
    .replace(/<br\s*\/*>/gi, '\n')
    .replace(/(<(p|div))/gi, '\n$1')
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\n\s*\n/g, '\n\n')
}
/**
 * @params {userObject: {id, plan_id, admin_role_id}}
 * @returns {boolean} is chat allowed
 */
const isChatAllowed = (user1, user2) => {
  if (
    typeof user1.plan_id !== 'number' &&
    typeof user1.admin_role_id !== 'number'
  )
    return false
  if (
    typeof user2.plan_id !== 'number' &&
    typeof user2.admin_role_id !== 'number'
  )
    return false

  let allow = false
  if (typeof user1.plan_id === 'number') {
    if (typeof user2.plan_id === 'number') allow = true
    else if (!user2.plan_id && typeof user2.admin_role_id === 'number') {
      console.log('thst')
      if (user2.admin_role_id === 0) allow = true
      // админ
      else if (user2.admin_role_id === 1) {
        // диетолог
        if (user1.plan_id > 1) allow = true
      } else if (user2.admin_role_id === 2) {
        // наставник
        if (user1.plan_id > 2) allow = true
      }
    }
  }
  return allow
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
    const uids = fromUserId + ',' + toUserId
    let query = `SELECT id, admin_role_id, plan_id FROM users WHERE id IN (${uids});`
    try {
      const { rows: users } = await db.query(query)
      if (users.length !== 2) return false

      const fromUser = users.filter(e => e.id === fromUserId)[0]
      const toUser = users.filter(e => e.id === toUserId)[0]

      let chatAllowed = isChatAllowed(fromUser, toUser)
      if (!chatAllowed) chatAllowed = isChatAllowed(toUser, fromUser)
      console.log(chatAllowed)
      if (chatAllowed) {
        text = formatChatText(text)
        query = `INSERT INTO chat_rooms(user_ids)VALUES (ARRAY[${uids}]);
                  INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${uids}]), '${text}') RETURNING id`

        const data = await db.query(query)

        return returnMessageId === true ? data[1].rows[0].id : true
      } else return false
    } catch (error) {
      return null
    }
  },
  async addMessage({ fromUserId, toUserId, text }, returnMessageId = true) {
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
