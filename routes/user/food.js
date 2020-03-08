const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth, requirePlan } = require('../../middleware')

const router = Router()

/**
 * @USER
 */

router.get(
  '/food/daily',
  requireAuth.userToken(),
  requirePlan(1),
  user.Food.getDailyMenu
)
router.get(
  '/food/tips-videos',
  requireAuth.userToken(),
  user.Food.getTipsVideos
)

module.exports = router
