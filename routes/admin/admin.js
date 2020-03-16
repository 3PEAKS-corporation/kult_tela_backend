const { Router } = require('express')
const { admin } = require('../../controllers/')
const {
  requireAuth,
  imageUpload,
  imageCompression
} = require('../../middleware/')

const router = Router()

router.post(
  '/admin/edit',
  requireAuth.adminToken,
  imageUpload.single('avatar_src'),
  imageCompression(false),
  admin.Common.updateInfo
)

module.exports = router
