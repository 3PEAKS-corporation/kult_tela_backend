const Auth = require('./user/Auth')
const { Plan } = require('./user/Plan')
const User = require('./user/User')
const Top = require('./user/Top')
const Exercise = require('./user/Exercise')

const _Exercise = require('./admin/Exercise')

module.exports = {
  // USER
  Auth,
  Plan,
  User,
  Top,
  Exercise,
  // ADMIN
  _Exercise
}
