const { requireAuth } = require('../../middleware/')
const { db } = require('../../../services/')
const { User } = require('../../../utils/')

const { SOCKETS_CHAT } = require('../../models/')

const MessageStatus = (io, socket) => {
  return {
    async message_last_seen(data) {
      console.log('[message_last_seen]')

      const info = {
        room_id: data.room_id,
        message_id: data.message_id,
        user_id: socket.currentUser.id
      }
      const user_ids = await User.Chat.MessageStatus.setLastSeenId(info)
      console.log(user_ids)

      if (user_ids) {
        user_ids.forEach(id => {
          io.to(SOCKETS_CHAT.getUser({ id })[0].socket).emit(
            'chat_message_last_seen',
            info
          )
        })
      }
    }
  }
}

module.exports = MessageStatus
