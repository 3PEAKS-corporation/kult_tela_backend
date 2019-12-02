const { Router } = require('express')
const { _Workout, Workout } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

/**
 * @ADMIN
 */

router.put('/admin/workout', requireAuth.adminToken, _Workout.create)
router.get('/workout/:id', requireAuth.userToken, Workout.getOneById)

module.exports = router
