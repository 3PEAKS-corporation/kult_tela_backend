const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth } = require('../../middleware')

const router = Router()

router.get('/public/user/:id', requireAuth.userToken(), user.Public.getUserById)

module.exports = router
