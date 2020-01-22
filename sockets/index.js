const { requireAuth } = require('./middleware/')
const { db } = require('../services/')

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
          user_id: socket.currentUser.id,
          text: data.text
        }

        let query = `INSERT INTO chat_messages(user_id, room_id, text) VALUES($1, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${message.user_id},${to_user_id}]), $2) RETURNING id`
        let values = [message.user_id, message.text]

        try {
          const { rows } = await db.query(query, values)
          const message_id = rows[0].id

          if (message_id) {
            query = `SELECT * FROM chat_messages_formatted() WHERE id=$1`
            values = [message_id]

            message = null
            const { rows } = await db.query(query, values)
            message = rows[0]

            if (message) {
              socket.emit('chat_message', message)
              console.log('emitted')

              const user = SOCKETS_CHAT.getUser({ id: to_user_id })

              const to_socket_id = user && user.socket

              if (to_socket_id)
                io.to(to_socket_id).emit('chat_message', message)
            }
          } else console.log('asdasds')
        } catch (error) {
          query = `INSERT INTO chat_rooms(user_ids)VALUES (ARRAY[${socket.currentUser.id}, ${data.to_user_id}]);
                  INSERT INTO chat_messages(user_id, room_id, text) VALUES(${socket.currentUser.id}, (SELECT id FROM chat_rooms where user_ids @> ARRAY[${socket.currentUser.id}, ${data.to_user_id}]), '${data.text}') RETURNING id`
          try {
            console.log('here im')
            const data = await db.query(query)
            const msg_id = data[1].rows[0].id
            if (msg_id) {
              query = `SELECT * FROM chat_messages_formatted() WHERE id=$1`
              values = [msg_id]
              const { rows } = await db.query(query, values)
              const message = rows[0]

              if (message) {
                message.to_user_id = to_user_id
                socket.emit('chat_message_first', message)
                console.log('emitted')

                const user = SOCKETS_CHAT.getUser({ id: to_user_id })

                const to_socket_id = user && user.socket

                if (to_socket_id) message.to_user_id = socket.currentUser.id
                io.to(to_socket_id).emit('chat_message_first', message)
              }
            }
          } catch (error) {
            throw error
          }
        }
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
