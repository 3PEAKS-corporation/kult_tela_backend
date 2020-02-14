const { Router } = require('express')
const { Top } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.get('/top/last-month', requireAuth.userToken(), Top.lastMonth)
router.get('/top/all-time', requireAuth.userToken(), Top.allTime)

module.exports = router
