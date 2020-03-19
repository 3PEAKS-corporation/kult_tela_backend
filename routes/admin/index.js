const roles = require('./roles')
const auth = require('./auth')
const request = require('./request')
const public_ = require('./public')
const stats = require('./stats')
const admin = require('./admin')
const promo = require('./promo')

module.exports = {
  roles,
  auth,
  request,
  public: public_,
  stats,
  admin,
  promo
}
