const { Router } = require('express')
const { Food } = require('../controllers/')
const { requireAuth, requirePlan } = require('../middleware/')

const router = Router()

/**
 * @USER
 */

router.get(
  '/food/daily',
  requireAuth.userToken(),
  requirePlan(1),
  Food.getDailyMenu
)
router.get('/food/tips-videos', requireAuth.userToken(), Food.getTipsVideos)

module.exports = router
