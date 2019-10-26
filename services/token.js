const jwt = require('jsonwebtoken')
const { env } = require('../config/')

const generateToken = ({ id, email }) => {
  const signature = env.SECRET
  const expiration = '31 days'

  return jwt.sign({ id, email }, signature, { expiresIn: expiration })
}

const getToken = req => req.headers.token

module.exports = {
  generateToken,
  getToken
}
