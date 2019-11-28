const { Router } = require('express')
const { _Recipe, Recipe } = require('../controllers')
const { requireAuth, imageUpload } = require('../middleware')

const router = Router()

/**
 * @ADMIN
 */

router.put('/admin/recipe', requireAuth.adminToken, imageUpload.single('image_src'), _Recipe.create)

/**
 * @USER
 */

router.get('/recipe/', requireAuth.userToken, Recipe.getAllForList)
router.get('/recipe/:id?', requireAuth.userToken, Recipe.getOneById)

module.exports = router
