const { Router } = require('express')
const { Admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get(
  '/admin/public/user/:user_id',
  requireAuth.adminToken,
  Admin.Public.getUserInfo
)

module.exports = router
