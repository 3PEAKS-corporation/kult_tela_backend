const { Router } = require('express')
const { _Exercise, Exercise } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

/**
 * @ADMIN
 */

router.put('/admin/exercise', requireAuth.adminToken, _Exercise.create)

router.get('/exercise/:id?', requireAuth.userToken, Exercise.getOneById)

module.exports = router
