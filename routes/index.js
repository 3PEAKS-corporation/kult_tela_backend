const auth = require('./auth')
const plan = require('./plan')
const user = require('./user')
const top = require('./top')
const exercise = require('./exercise')
const recipe = require('./recipe')
const workout = require('./workout')

const init = app => {
  app.use(auth)
  app.use(plan)
  app.use(user)
  app.use(top)
  app.use(exercise)
  app.use(recipe)
  app.use(workout)
}

module.exports = {
  init
}
