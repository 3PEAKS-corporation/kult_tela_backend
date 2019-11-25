const { Router } = require('express')
const { _Recipe } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

/**
 * @ADMIN
 */
router.put('/admin/exercise', requireAuth.adminToken, imageUpload('image_src'), _Exercise.create) //TODO: admin auth

module.exports = router
