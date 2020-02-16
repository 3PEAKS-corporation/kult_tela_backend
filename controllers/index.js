const Auth = require('./user/Auth')
const Plan = require('./user/Plan')
const User = require('./user/User/')
const Top = require('./user/Top')
const Exercise = require('./user/Exercise')
const Workout = require('./user/Workout')
const Food = require('./user/Food')
const Chat = require('./user/Chat')
const Public = require('./user/Public')
const Request = require('./user/Request')

const Kassa = require('./user/Kassa/')

const Admin = require('./admin/index')

/**
 * NAMES WITH "_" GOES AS @ADMIN CONTROLLERS
 */

module.exports = {
  // USER
  Auth,
  Plan,
  User,
  Top,
  Exercise,
  Workout,
  Food,
  Chat,
  Public,
  Request,
  //Kassa
  Kassa,
  // ADMIN
  Admin
}
