const Auth = require('./user/Auth')
const { Plan } = require('./user/Plan')
const User = require('./user/User')
const Top = require('./user/Top')
const Exercise = require('./user/Exercise')
const Recipe = require('./user/Recipe')

const _Exercise = require('./admin/Exercise')
const _Recipe = require('./admin/Recipe')

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
  // ADMIN
  _Exercise,
  _Recipe
}
