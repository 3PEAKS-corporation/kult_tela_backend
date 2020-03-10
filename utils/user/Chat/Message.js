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
  async addMessage(
    { fromUserId, toUserId, roomId, text, attachments },
    returnMeta = true
  ) {
    console.log('inside', attachments)
    if (typeof fromUserId === 'number' && typeof toUserId === 'number') {
      const isAllowed = await Protection.isMessageAllowed(fromUserId, toUserId)
      if (!isAllowed) return false
    }

    text = formatChatText(text)
    let query, values
    if (
      !attachments ||
      !attachments[0] ||
      !attachments[0].type ||
      !attachments[0].src
    ) {
      query = `INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[$1::int[]] AND id=$2), $3) RETURNING id, (SELECT user_ids FROM chat_rooms WHERE user_ids @> ARRAY[$1::int[]] AND id=$2)`
      values = [[fromUserId], roomId, text]
    } else {
      query = `INSERT INTO chat_messages(user_id, room_id, text, attachments) VALUES(
       ${fromUserId},
    (SELECT id FROM chat_rooms where user_ids @> ARRAY[$1::int[]] AND id=$2), 
    $3, 
    array_append('{}', jsonb_build_object(
    'type', $4::varchar,
    'image_src', $5::varchar
    )::jsonb)) RETURNING id, (SELECT user_ids FROM chat_rooms WHERE user_ids @> ARRAY[$1::int[]] AND id=$2)`
      values = [
        [fromUserId],
        roomId,
        text || '',
        attachments[0].type,
        attachments[0].src
      ]
    }

    try {
      const data = await db.query(query, values)
      console.log('rows', data.rows)
      if (data.rows[0]) {
        const message_id = data.rows[0] && data.rows[0].id
        return returnMeta === true && data.rows[0]
          ? { message_id: message_id, user_ids: data.rows[0].user_ids }
          : true
      } else {
        throw 'init room'
      }
    } catch (error) {
      console.log(error)
      const r = await initRoomWithMessage({ fromUserId, toUserId, text })
      console.log(r)
      if (r) {
        return { ...r, inited: true }
      } else return null
    }
  }
}

const initRoomWithMessage = async (
  { fromUserId, toUserId, text },
  returnMeta = true
) => {
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
    query = `INSERT INTO chat_rooms(user_ids)VALUES (ARRAY[${uids}]) RETURNING user_ids;
                  INSERT INTO chat_messages(user_id, room_id, text) VALUES(${fromUserId}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${uids}] AND conversation=false), '${text}') RETURNING id`

    const data = await db.query(query)

    return returnMeta === true && data[1].rows[0] && data[0].rows[0]
      ? { message_id: data[1].rows[0].id, user_ids: data[0].rows[0].user_ids }
      : true
  } catch (error) {
    return null
  }
}

module.exports = Messages
