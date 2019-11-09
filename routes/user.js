const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.post('/user/update-weight', requireAuth, User.updateWeight)

module.exports = router
