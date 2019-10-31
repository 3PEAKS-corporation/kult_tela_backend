const { Router } = require('express')
const { User } = require('../controllers/')
const { requireToken } = require('../middleware/requireAuth')

const router = Router()

router.post('/user/update-weight', requireToken, User.updateWeight)

module.exports = router
