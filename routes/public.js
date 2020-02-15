const { Router } = require('express')
const { Public } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.get('/public/user/:id', requireAuth.userToken(), Public.getUserById)

module.exports = router
