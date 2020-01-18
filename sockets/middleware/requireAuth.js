const { db } = require('../../services/')

const getToken = socket => socket.handshake.query.token

const requireAuth = {
  async requireToken(socket, next) {
    const token = getToken(socket)
    if (!token) return next(new Error('Токен не существует!'))

    const query = `SELECT users.id as id, users.plan_id as plan_id FROM tokens
                    LEFT JOIN users
                    ON tokens.user_id = users.id
                    WHERE token =$1`

    const values = [token]
    try {
      const { rows } = await db.query(query, values)

      if (!rows[0].id) return next(new Error('Токен не существует!'))
      else {
        const user = rows[0]
        socket.currentUser = { id: user.id, plan_id: user.plan_id }

        return next()
      }
    } catch (error) {
      return next(new Error('Токен не существует!'))
    }
  }
}

module.exports = requireAuth
