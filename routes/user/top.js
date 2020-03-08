const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth } = require('../../middleware')

const router = Router()

router.get('/top/last-month', requireAuth.userToken(), user.Top.lastMonth)
router.get('/top/all-time', requireAuth.userToken(), user.Top.allTime)

module.exports = router
