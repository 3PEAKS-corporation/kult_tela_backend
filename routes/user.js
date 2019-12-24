const { Router } = require('express')
const { User, Food } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.post('/user/update/weight', requireAuth.userToken, User.Weight.update)
router.post('/user/update/workout', requireAuth.userToken, User.Workout.update)
router.post(
  '/user/edit/profile',
  requireAuth.userToken,
  User.Common.editProfileData
)

router.get(
  '/user/notification/set-last-seen/:id',
  requireAuth.userToken,
  User.Notification.setLastSeen
)

module.exports = router
