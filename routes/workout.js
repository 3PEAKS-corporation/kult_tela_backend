const { Router } = require('express')
const { User, Workout } = require('../controllers/')
const { requireAuth, imageUpload, requirePlan } = require('../middleware/')

const router = Router()

router.get(
  '/workout/level',
  requireAuth.userToken(false),
  requirePlan(1),
  User.Workout.getLevels
)

router.post(
  '/workout/level',
  requireAuth.userToken(),
  requirePlan(1),
  User.Workout.setLevels
)

router.get(
  '/workout/plan',
  requireAuth.userToken(),
  requirePlan(1),
  Workout.get()
)
router.get(
  '/workout/plan/previous',
  requireAuth.userToken(),
  requirePlan(1),
  Workout.get(true)
)

module.exports = router
