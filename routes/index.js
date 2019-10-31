const auth = require('./auth')
const plans = require('./plans')
const user = require('./user')

const init = app => {
  app.use(auth)
  app.use(plans)
  app.use(user)
}

module.exports = {
  init
}
