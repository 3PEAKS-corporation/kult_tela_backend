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
        id: user.id
      }
      if (typeof user.plan_id === 'number')
        socket.currentUser.plan_id = user.plan_id
      if (typeof user.admin_role_id === 'number')
        socket.currentUser.admin_role_id = user.admin_role_id
      return next()
    } else return next(new Error('Токен не существует или отсутствует.'))
  }
}

module.exports = requireAuth
