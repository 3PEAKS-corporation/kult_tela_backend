const auth = require('./auth')
const plans = require('./plans')
const user = require('./user')
const top = require('./top')

const init = app => {
  app.use(auth)
  app.use(plans)
  app.use(user)
  app.use(top)
}

module.exports = {
  init
}
