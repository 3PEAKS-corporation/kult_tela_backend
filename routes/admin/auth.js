const { Router } = require('express')
const { Admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.post('/admin/auth/signup', Admin.Auth.signUp)

module.exports = router
