const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router
  .route('/users')
  .put(User.signup)
  .post(User.login)
  .get(requireAuth.requireToken, User.userByToken)

router.route('/auth').post(User.createBlankProfile)

module.exports = router
