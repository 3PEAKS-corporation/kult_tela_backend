const { db, utils } = require('../../services')
const { copyDATA } = require('../../data/')
const Exercise = {
  get(req, res) {
    const exercises = copyDATA('exercise_videos')
    const id = req.query.id
    if (id && typeof parseInt(id) === 'number') {
      const exercise = exercises.filter(e => e.id === parseInt(id))[0]
      if (exercise) return utils.response.success(res, [exercise])
      else return utils.response.error(res, 'Упражнение не существует')
    } else return utils.response.success(res, exercises)
  }
}

module.exports = Exercise
