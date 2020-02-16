const { db, utils } = require('../../services')
const { DATA } = require('../../data/')
const Exercise = {
  getAll(req, res) {
    return utils.response.success(res, DATA.exercise_videos)
  }
}

module.exports = Exercise
