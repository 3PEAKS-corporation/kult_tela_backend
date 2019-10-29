const auth = require('./auth')
const plans = require('./plans')

const init = app => {
  app.use(auth)
  app.use(plans)
}

module.exports = {
  init
}
