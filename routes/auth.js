const { Router } = require('express')
const { Auth } = require('../controllers/')
const { requireAuth, imageUpload, imageCompression } = require('../middleware/')

const router = Router()
router
  .route('/auth')
  .post(Auth.login)
  .get(requireAuth.userToken, Auth.userByToken)

router
  .route('/auth/signup')
  .put(Auth.createBlankProfile)
  .post(Auth.isFillAllowed)

router.post(
  '/auth/signup/fill',
  imageUpload.single('avatar_src'),
  imageCompression(false),
  Auth.fillInfo
)

module.exports = router
