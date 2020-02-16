const { Router } = require('express')
const { Exercise } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

router.get('/exercise', requireAuth.userToken(), Exercise.getAll)

module.exports = router
