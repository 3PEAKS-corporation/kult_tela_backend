const { Router } = require('express')
const { _Recipe } = require('../controllers')
const { requireAuth, imageUpload } = require('../middleware')

const router = Router()

/**
 * @ADMIN
 */

router.put('/admin/recipe', requireAuth.adminToken, imageUpload.single('image_src'), _Recipe.create)

module.exports = router
