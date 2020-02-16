const { Router } = require('express')
const { Request } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.post('/request', requireAuth.userToken(), Request.add)

module.exports = router
