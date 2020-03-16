const roles = require('./roles')
const auth = require('./auth')
const request = require('./request')
const public_ = require('./public')
const stats = require('./stats')
const admin = require('./admin')

module.exports = {
  roles,
  auth,
  request,
  public: public_,
  stats,
  admin
}
