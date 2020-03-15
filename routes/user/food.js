const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth, requirePlan } = require('../../middleware')

const router = Router()

router.get(
  '/food/daily',
  requireAuth.userToken(),
  requirePlan(1),
  user.Food.getDailyMenu
)

router.get(
  '/food/next',
  requireAuth.userToken(),
  requirePlan(1),
  user.Food.getNextDays
)

router.get(
  '/food/tips-videos',
  requireAuth.userToken(),
  user.Food.getTipsVideos
)

module.exports = router
