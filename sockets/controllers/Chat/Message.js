const { requireAuth } = require('../../middleware/')
const { db } = require('../../../services/')
const { User } = require('../../../utils/')

const { SOCKETS_CHAT } = require('../../models/')

const Message = (io, socket) => {
  return {
    async message(data) {
      console.log('[chat_message]')
      const to_user_id = data.to_user_id

      if (to_user_id) {
        let message = {
          fromUserId: socket.currentUser.id,
          toUserId: to_user_id,
          text: data.text
        }

        try {
          let message_id = await User.Chat.Message.addMessage(message)

          let roomInited = false
          if (message_id === null) {
            roomInited = true
            message_id = await User.Chat.Message.initRoomWithMessage(message)
          } else if (message_id === false) {
            socket.emit('chat_room_locked', { room_id: data.room_id })
            return
          }

          if (typeof message_id === 'number') {
            let query = `SELECT * FROM chat_messages_formatted WHERE id=$1`
            let values = [message_id]

            const { rows } = await db.query(query, values)
            const dbMessage = rows[0]

            if (dbMessage) {
              const event = roomInited ? 'chat_message_init' : 'chat_message'

              if (roomInited) dbMessage.user_id = to_user_id

              const to_cur_user = SOCKETS_CHAT.getUser({
                id: socket.currentUser.id
              })
              io.emitArray(to_cur_user.sockets, event, dbMessage)

              const to_user = SOCKETS_CHAT.getUser({ id: to_user_id })

              if (to_user) {
                if (roomInited) dbMessage.user_id = socket.currentUser.id
                io.emitArray(to_user.sockets, event, dbMessage)
              }
            }
          }
        } catch (error) {}
      }
    }
  }
}

module.exports = Message
