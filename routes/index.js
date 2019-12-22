const auth = require('./auth')
const plan = require('./plan')
const user = require('./user')
const top = require('./top')
const exercise = require('./exercise')
const workout = require('./workout')
const food = require('./food')

const init = app => {
  app.use(auth)
  app.use(plan)
  app.use(user)
  app.use(top)
  app.use(exercise)
  app.use(workout)
  app.use(food)
}

module.exports = {
  init
}
