const auth = require('./auth')
const plans = require('./plans')
const user = require('./user')
const top = require('./top')
const exercise = require('./exercise')

const init = app => {
  app.use(auth)
  app.use(plans)
  app.use(user)
  app.use(top)
  app.use(exercise)
}

module.exports = {
  init
}
