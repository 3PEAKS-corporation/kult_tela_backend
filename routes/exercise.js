const { Router } = require('express')
const { _Exercise } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

/**
 * @ADMIN
 */

router.put('/admin/exercise', requireAuth.adminToken, _Exercise.create)

module.exports = router
