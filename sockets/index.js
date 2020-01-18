const { requireAuth } = require('./middleware/')

let SOCKETS = []

const addUserToSockets = user => {
  SOCKETS.push(user)
}

const removeUserBySocketFromTokens = socket => {
  SOCKETS = SOCKETS.filter(user => user.socket !== socket)
}

const init = io => {
  io.use(requireAuth.requireToken).on('connection', socket => {
    console.log('user connected with id: ', socket.id)
    addUserToSockets({ socket: socket.id, ...socket.currentUser })

    socket.on('disconnect', () => {
      removeUserBySocketFromTokens(socket.id)
      console.log('user disc with id: ', socket.currentUser.id)
      console.log(SOCKETS)
    })
  })
}

module.exports = {
  init
}
