const { Router } = require('express')
const { User } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.post('/user/update/weight', requireAuth.userToken, User.updateWeight)
router.post('/user/update/workout', requireAuth.userToken, User.updateWorkout)

module.exports = router
