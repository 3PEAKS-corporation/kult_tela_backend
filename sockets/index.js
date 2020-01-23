const { requireAuth } = require('./middleware/')
const { db } = require('../services/')
const { User } = require('../utils/')

const { SOCKETS_CHAT } = require('./models/')

const init = io => {
  io.use(requireAuth.requireToken).on('connection', socket => {
    console.log('[connected]', socket.id)

    SOCKETS_CHAT.add({ id: socket.currentUser.id, socket: socket.id })

    socket.on('chat_message', async data => {
      console.log('[chat_message]')

      const to_user_id = data.to_user_id

      if (to_user_id) {
        let message = {
          fromUserId: socket.currentUser.id,
          toUserId: to_user_id,
          text: data.text
        }

        try {
          let message_id = await User.Chat.addMessage(message)

          let roomInited = false
          if (!message_id) {
            roomInited = true
            message_id = await User.Chat.initRoomWithMessage(message)
          }

          if (message_id) {
            query = `SELECT * FROM chat_messages_formatted() WHERE id=$1`
            values = [message_id]

            const { rows } = await db.query(query, values)
            const dbMessage = rows[0]

            if (dbMessage) {
              const event = roomInited ? 'chat_message_init' : 'chat_message'

              if (roomInited) dbMessage.to_user_id = to_user_id

              socket.emit(event, dbMessage)

              const to_user = SOCKETS_CHAT.getUser({ id: to_user_id })

              if (to_user && to_user.length > 0) {
                if (roomInited) dbMessage.to_user_id = socket.currentUser.id
                to_user.forEach(user => {
                  io.to(user.socket).emit(event, dbMessage)
                })
              }
            }
          }
        } catch (error) {}
      }
    })

    socket.on('disconnect', () => {
      console.log('[disconnected]', socket.id)
      SOCKETS_CHAT.remove(socket.id)
    })
  })
}

module.exports = {
  init
}
