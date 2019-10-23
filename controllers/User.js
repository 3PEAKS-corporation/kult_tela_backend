const db = require('../services/db')

const User = {
  async create(req, res) {
    return res.status(200).send({ report: 'success' })
  }
}

module.exports = User
