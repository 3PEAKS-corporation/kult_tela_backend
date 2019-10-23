const { Router } = require('express')
const { User } = require('../controllers/')

const router = Router()

router.get('/users', User.create)

module.exports = router
