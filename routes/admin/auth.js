const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.post('/admin/auth/signup', admin.Auth.signUp)

module.exports = router
