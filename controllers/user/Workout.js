const { db, utils } = require('../../services')
const { DATA } = require('../../data')

const Workout = {
  async get(req, res) {
    return utils.response.error(res)
  }
}

module.exports = Workout
