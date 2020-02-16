const { Router } = require('express')
const { Kassa } = require('../controllers/')
const { requireAuth, requirePlan } = require('../middleware/')

const router = Router()

router.post('/kassa/notification', Kassa.consumeNotification)

module.exports = router
