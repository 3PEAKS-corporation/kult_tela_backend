const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth } = require('../../middleware')

const router = Router()

router.post('/request', requireAuth.userToken(), user.Request.add)
router.get('/request', requireAuth.userToken(), user.Request.getInfo)

module.exports = router
