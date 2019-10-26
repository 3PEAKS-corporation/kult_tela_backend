const jwt = require('jsonwebtoken')
const { env } = require('../config/')

const generateToken = ({ id, email }) => {
  const signature = env.SECRET
  const expiration = '30 days'

  return jwt.sign({ id, email }, signature, { expiresIn: expiration })
}

module.exports = {
  generateToken
}
