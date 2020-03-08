const { Router } = require('express')
const { user } = require('../../controllers')
const {
  requireAuth,
  imageUpload,
  requirePlan,
  imageCompression
} = require('../../middleware')

const router = Router()

/**
 * @UPDATES
 */

router.post(
  '/user/update/weight',
  requireAuth.userToken(),
  user.User.Weight.update
)
router.post(
  '/user/update/info',
  requireAuth.userToken(),
  imageUpload.single('avatar_src'),
  imageCompression(false),
  user.User.Common.updateInfo
)

/**
 * @NOTIFICATIONS
 */

router.get(
  '/user/notification/set-last-seen/:id',
  requireAuth.userToken(true),
  user.User.Notification.setLastSeen
)

/**
 * @FOOD
 */

router.get(
  '/user/food/report',
  requireAuth.userToken(),
  requirePlan(1),
  user.User.Food.getStateOfReport
)

router.post(
  '/user/food/report',
  requireAuth.userToken(),
  requirePlan(1),
  imageUpload.array('images'),
  imageCompression(true),
  user.User.Food.addReport
)

/**
 * @SUBSCRIPTION
 */
router.post(
  '/user/subscription/extend',
  requireAuth.userToken(true),
  user.User.Subscription.extend
)

/**
 * @TUTOR
 */

router.get(
  '/user/tutor',
  requireAuth.userToken(),
  requirePlan(3),
  user.User.Tutor.getAll
)

router.post(
  '/user/tutor',
  requireAuth.userToken(),
  requirePlan(3),
  user.User.Tutor.set
)

module.exports = router
