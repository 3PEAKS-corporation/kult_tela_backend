const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth, imageUpload, requirePlan } = require('../middleware/')

const router = Router()

/**
 * @UPDATES
 */

router.post('/user/update/weight', requireAuth.userToken, User.Weight.update)
router.post('/user/update/workout', requireAuth.userToken, User.Workout.update)
router.post(
  '/user/edit/profile',
  requireAuth.userToken,
  User.Common.editProfileData
)

/**
 * @NOTIFICATIONS
 */

router.get(
  '/user/notification/set-last-seen/:id',
  requireAuth.userToken,
  User.Notification.setLastSeen
)

/**
 * @FOOD
 */

router.get(
  '/user/food/report',
  requireAuth.userToken,
  requirePlan(1),
  User.Food.getStateOfReport
)

router.post(
  '/user/food/report',
  requireAuth.userToken,
  requirePlan(1),
  imageUpload.array('images'),
  User.Food.addReport
)

module.exports = router
