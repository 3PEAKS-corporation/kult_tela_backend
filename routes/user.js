const { Router } = require('express')
const { User } = require('../controllers/')
const {
  requireAuth,
  imageUpload,
  requirePlan,
  imageCompression
} = require('../middleware/')

const router = Router()

/**
 * @UPDATES
 */

router.post('/user/update/weight', requireAuth.userToken(), User.Weight.update)
router.post(
  '/user/update/info',
  requireAuth.userToken(),
  imageUpload.single('avatar_src'),
  imageCompression(false),
  User.Common.updateInfo
)

/**
 * @NOTIFICATIONS
 */

router.get(
  '/user/notification/set-last-seen/:id',
  requireAuth.userToken(true),
  User.Notification.setLastSeen
)

/**
 * @FOOD
 */

router.get(
  '/user/food/report',
  requireAuth.userToken(),
  requirePlan(1),
  User.Food.getStateOfReport
)

router.post(
  '/user/food/report',
  requireAuth.userToken(),
  requirePlan(1),
  imageUpload.array('images'),
  imageCompression(true),
  User.Food.addReport
)

/**
 * @SUBSCRIPTION
 */
router.post(
  '/user/subscription/extend',
  requireAuth.userToken(true),
  User.Subscription.extend
)

module.exports = router
