const { Router } = require('express')
const { _Exercise } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

router.put('/admin/exercise', requireAuth.adminToken, _Exercise.create) //TODO: admin auth

module.exports = router
