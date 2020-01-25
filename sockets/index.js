const { requireAuth } = require('./middleware/')
const { db } = require('../services/')
const { User } = require('../utils/')

const { SOCKETS_CHAT } = require('./models/')

const { Chat } = require('./controllers/')

function emitArray(io) {
  return function(sockets, event, param) {
    sockets.forEach(socket => {
      console.log('emitted to socket', socket)

      io.to(socket).emit(event, param)
    })
  }
}

const init = io => {
  io.emitArray = emitArray(io)

  Chat(io)
}

module.exports = {
  init
}
