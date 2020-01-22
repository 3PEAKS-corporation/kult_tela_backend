const {
  User: { Token }
} = require('../../utils/')

const getToken = socket => socket.handshake.query.token

const requireAuth = {
  async requireToken(socket, next) {
    const token = getToken(socket)

    const user = await Token.getUserByToken(token)

    if (user) {
      socket.currentUser = {
        id: user.id,
        plan_id: user.plan_id
      }
      return next()
    } else return next(new Error('Токен не существует или отсутствует.'))
  }
}

module.exports = requireAuth
