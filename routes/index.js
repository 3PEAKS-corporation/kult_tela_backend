const kassa = require('./kassa')
const user = require('./user/')
const admin = require('./admin/')

const init = (app, io) => {
  app.use(user.auth)
  app.use(user.plan)
  app.use(user.user)
  app.use(user.top)
  app.use(user.exercise)
  app.use(user.workout)
  app.use(user.food)
  app.use(user.chat)
  app.use(user.public)
  app.use(user.request)
  app.use(user.support)

  app.use(kassa)

  app.use(admin.roles)
  app.use(admin.auth)
  app.use(admin.request)
  app.use(admin.public)
  app.use(admin.stats)
}

module.exports = {
  init
}
