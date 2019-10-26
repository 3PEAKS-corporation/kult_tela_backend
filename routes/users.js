const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.put('/users', User.signup)
router.post('/users', User.login)
router.get('/users', User.tokenAuth)

module.exports = router
