const { Router } = require('express')
const { Food } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

/**
 * @USER
 */

router.get('/food/daily', requireAuth.userToken, Food.getDailyMenu)

module.exports = router
