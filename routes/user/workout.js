const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth, imageUpload, requirePlan } = require('../../middleware')

const router = Router()

router.get(
  '/workout/level',
  requireAuth.userToken(false),
  requirePlan(1),
  user.User.Workout.getLevels
)

router.post(
  '/workout/level',
  requireAuth.userToken(),
  requirePlan(1),
  user.User.Workout.setLevels
)

router.get(
  '/workout/plan',
  requireAuth.userToken(),
  requirePlan(1),
  user.Workout.get()
)
router.get(
  '/workout/plan/previous',
  requireAuth.userToken(),
  requirePlan(1),
  user.Workout.get(true)
)
router.get(
  '/workout/plan/next',
  requireAuth.userToken(),
  requirePlan(1),
  user.Workout.get(false, true)
)

module.exports = router
