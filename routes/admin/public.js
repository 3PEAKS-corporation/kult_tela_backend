const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get(
  '/admin/public/user/:user_id',
  requireAuth.adminToken,
  admin.Public.getUserInfo
)

module.exports = router
