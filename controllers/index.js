const Auth = require('./user/Auth')
const { Plan } = require('./user/Plan')
const User = require('./user/User')
const Top = require('./user/Top')
const Exercise = require('./user/Exercise')
const Recipe = require('./user/Recipe')
const Workout = require('./user/Workout')

const _Exercise = require('./admin/Exercise')
const _Recipe = require('./admin/Recipe')
const _Workout = require('./admin/Workout')

/**
 * NAMES WITH "_" GOES AS ADMIN CONTROLLERS
 */

module.exports = {
  // USER
  Auth,
  Plan,
  User,
  Top,
  Exercise,
  Recipe,
  Workout,
  // ADMIN
  _Exercise,
  _Recipe,
  _Workout
}
