const { User } = require('../../../utils/')

const { SOCKETS_CHAT } = require('../../models/')

const MessageUtils = (io, socket) => {
  return {
    async message_last_seen(data) {
      console.log('[message_last_seen]')

      const info = {
        room_id: data.room_id,
        message_id: data.message_id,
        user_id: socket.currentUser.id
      }
      const user_ids = await User.Chat.MessageUtils.setLastSeenId(info)
      if (user_ids) {
        user_ids.forEach(id => {
          io.to(SOCKETS_CHAT.getUser({ id })[0].socket).emit(
            'chat_message_last_seen',
            info
          )
        })
      }
    },
    async messages_history_load(data) {
      const info = {
        room_id: data.room_id,
        from_message_id: data.from_message_id,
        user_id: socket.currentUser.id
      }
      const messages = await User.Chat.MessageUtils.loadMessagesHistory(info)
      if (messages.length > 0)
        socket.emit('chat_messages_history_load', messages)
      else if (messages.length === 0)
        return socket.emit('chat_messages_history_full')
    }
  }
}

module.exports = MessageUtils
