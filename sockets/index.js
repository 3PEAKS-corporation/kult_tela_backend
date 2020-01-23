const { requireAuth } = require('./middleware/')
const { db } = require('../services/')
const { User } = require('../utils/')

const { SOCKETS_CHAT } = require('./models/')

const { Chat } = require('./controllers/')

const init = io => {
  Chat(io)
}

module.exports = {
  init
}
