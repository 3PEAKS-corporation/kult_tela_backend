const auth = require('./auth')
const plan = require('./plan')
const user = require('./user')
const top = require('./top')
const exercise = require('./exercise')
const workout = require('./workout')
const food = require('./food')
const chat = require('./chat')
const public_ = require('./public')
const kassa = require('./kassa')
const request = require('./request')

const init = (app, io) => {
  app.use(auth)
  app.use(plan)
  app.use(user)
  app.use(top)
  app.use(exercise)
  app.use(workout)
  app.use(food)
  app.use(chat)
  app.use(public_)
  app.use(kassa)
  app.use(request)
}

module.exports = {
  init
}
