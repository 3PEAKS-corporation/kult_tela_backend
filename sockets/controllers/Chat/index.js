const { requireAuth } = require('../../middleware/')

const { SOCKETS_CHAT } = require('../../models/')

const Message = require('./Message')
const MessageUtils = require('./MessageUtils')

const Chat = io => {
  io.use(requireAuth.requireToken).on('connection', socket => {
    const _Message = Message(io, socket)
    const _MessageUtils = MessageUtils(io, socket)
    console.log('[connected]', socket.id)
    SOCKETS_CHAT.add(socket.currentUser.id, socket.id)
    console.log(SOCKETS_CHAT.data)

    socket.on('chat_message', _Message.message)

    socket.on('chat_message_set_last_seen', _MessageUtils.message_last_seen)

    socket.on('chat_messages_history_load', _MessageUtils.messages_history_load)

    socket.on('disconnect', () => {
      console.log('[disconnected]', socket.id)
      SOCKETS_CHAT.remove(socket.id)
      console.log(SOCKETS_CHAT.data)
    })
  })
}

module.exports = Chat
