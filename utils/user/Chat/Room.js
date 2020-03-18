const { db, utils } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')
const { copyDATA } = require('../../../data/')
const Common = require('../Common')

const Room = {
  async get({ currentUserId, userId, all = false, conversation = null }) {
    let query, values
    if (!conversation) {
      if (all === true) {
        query = `SELECT *
                 FROM chat_rooms
                 WHERE $1 = ANY (user_ids)`
        values = [currentUserId]
      } else if (currentUserId && userId && !all) {
        query = `SELECT * FROM chat_rooms WHERE user_ids @> ARRAY[${currentUserId},${userId}] AND conversation=false`
      }
    } else if (conversation && typeof conversation.id === 'number') {
      query = `SELECT *
                 FROM chat_rooms
                 WHERE id=$1 AND conversation=true`
      values = [conversation.id]
    }

    try {
      let { rows: chats } = await db.query(query, values)
      if (chats.length !== 0) {
        let user_ids = []
        chats.forEach(e => {
          e.user_ids.forEach(e => {
            if (e !== currentUserId) user_ids.push(e)
          })
        })

        query = `SELECT id, first_name || ' ' || last_name as name, admin_role_id, rank, avatar_src  FROM users WHERE id=ANY(ARRAY[$1::int[]])`
        values = [user_ids]

        let { rows: users } = await db.query(query, values)

        const admin_role_names = copyDATA('admin_roles')

        users = users.map(e => {
          if (e.avatar_src) e.avatar_src = utils.getImageUrl(e.avatar_src)
          else delete e.avatar_src

          if (typeof e.admin_role_id === 'number') {
            const role = admin_role_names.filter(
              e2 => e2.value === e.admin_role_id
            )[0]
            if (role) e.admin_role_name = role.name
          } else delete e.admin_role_id

          return e
        })

        chats = chats.map(chat => {
          if (!chat.name) delete chat.name
          chat.users = users.filter(
            e => chat.user_ids.includes(e.id) && e.id !== currentUserId
          )
          chat.users = chat.users.map(e => {
            e.status = SOCKETS_CHAT.isUser({ id: e.id })
            return e
          })
          if (!chat.conversation) delete chat.conversation
          if (chat.image_src) chat.image_src = utils.getImageUrl(chat.image_src)
          else delete chat.image_src
          return chat
        })

        if (all === true) {
          const chat_ids = chats.map(chat => chat.id)
          /* getting last messages for each chat if 'all' is true */
          query = `WITH ids as (SELECT  MAX(id) as id, room_id
                FROM chat_messages
                WHERE room_id = ANY(ARRAY[$1::int[]])
                GROUP BY room_id )
                SELECT * FROM chat_messages WHERE id= ANY(ARRAY(SELECT id FROM ids))`
          values = [chat_ids]

          const { rows: last_messages } = await db.query(query, values)

          chats = chats.map(chat => {
            let last_message = last_messages.filter(
              item => item.room_id === chat.id
            )[0]
            chat.messages = last_message ? [last_message] : null
            return chat
          })
        } else {
          const chat_id = chats[0].id
          if (typeof chat_id === 'number') {
            query = `SELECT *
                     FROM chat_messages
                     WHERE room_id = $1
                     ORDER BY id DESC
                     LIMIT 40`
            values = [chat_id]

            const { rows: messages } = await db.query(query, values)

            if (messages.length < 40) chats[0].history_is_full = true
            if (messages.length === 0 || !messages) chats[0].is_empty = true

            //// TODO: выделить это в отдельную функцию сборки сообщений [2]
            chats[0].messages = messages.reverse().map(e => {
              delete e.room_id
              if (e.attachments) {
                e.attachments = e.attachments.map(a => {
                  a.src = utils.getImageUrl(a.src)
                  return a
                })
              }
              return e
            })
          }
        }

        return chats
      } else {
        const user = await Common.getPublicUserData(userId)

        if (user) {
          if (typeof user.admin_role_id !== 'number') delete user.admin_role_id
          else {
            const admin_role_names = copyDATA('admin_roles')
            user.admin_role_name = admin_role_names.filter(
              e => e.value === user.admin_role_id
            )[0].name
          }

          const info = {
            users: [user],
            user_ids: [user.id],
            is_empty: true
          }

          return [info]
        }
      }
    } catch (e) {
      return null
    }
  }
}

module.exports = Room
