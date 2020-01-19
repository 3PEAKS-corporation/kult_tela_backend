const { requireAuth } = require('./middleware/')

const { SOCKETS_CHAT } = require('./models/')

const init = io => {
  io.on('connection', socket => {
    console.log('connected')

    socket.on('eventAA', data => {
      console.log(data)
      io.emit('chat_pinged', 'chat pinged mens')
    })
  })
}

module.exports = {
  init
}
