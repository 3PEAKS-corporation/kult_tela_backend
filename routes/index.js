const users = require('./users')

const init = app => {
  app.use(users)
}

module.exports = {
  init
}
