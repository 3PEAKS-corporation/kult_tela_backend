const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth, imageUpload } = require('../../middleware')

const router = Router()

router.get('/exercise', requireAuth.userToken(), user.Exercise.get)

module.exports = router
