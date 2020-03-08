const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth } = require('../../middleware')

const router = Router()

router.get('/support', requireAuth.userToken(), user.Support.getAdminId)

module.exports = router
