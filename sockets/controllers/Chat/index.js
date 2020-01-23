const { requireAuth } = require('../../middleware/')

const { SOCKETS_CHAT } = require('../../models/')

const Message = require('./Message')
const MessageStatus = require('./MessageStatus')

const Chat = io => {
  Message
  io.use(requireAuth.requireToken).on('connection', socket => {
    const _Message = Message(io, socket)
    const _MessageStatus = MessageStatus(io, socket)
    console.log('[connected]', socket.id)

    SOCKETS_CHAT.add({ id: socket.currentUser.id, socket: socket.id })

    socket.on('chat_message', _Message.message)

    socket.on('chat_message_set_last_seen', _MessageStatus.message_last_seen)

    socket.on('disconnect', () => {
      console.log('[disconnected]', socket.id)
      SOCKETS_CHAT.remove(socket.id)
    })
  })
}

module.exports = Chat
