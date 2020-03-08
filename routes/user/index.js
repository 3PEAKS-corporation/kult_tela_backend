const auth = require('./auth')
const plan = require('./plan')
const user = require('./user')
const top = require('./top')
const exercise = require('./exercise')
const workout = require('./workout')
const food = require('./food')
const chat = require('./chat')
const public_ = require('./public')
const request = require('./request')
const support = require('./support')

module.exports = {
  auth,
  plan,
  user,
  top,
  exercise,
  workout,
  food,
  chat,
  public: public_,
  request,
  support
}
