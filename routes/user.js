const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.post('/user/update/weight', requireAuth.userToken, User.updateWeight)

module.exports = router
