const { Router } = require('express')
const { admin } = require('../../controllers/')
const {
  requireAuth,
  imageUpload,
  imageCompression
} = require('../../middleware/')

const router = Router()

router.post(
  '/admin/auth/signup',
  imageUpload.single('avatar_src'),
  imageCompression(false),
  admin.Auth.signUp
)

module.exports = router
