const { Router } = require('express')
const { user } = require('../../controllers')
const {
  requireAuth,
  imageUpload,
  imageCompression
} = require('../../middleware')

const router = Router()
router
  .route('/auth')
  .post(user.Auth.login)
  .get(requireAuth.userToken(true), user.Auth.userByToken)

router
  .route('/auth/signup')
  .put(user.Auth.createBlankProfile)
  .post(user.Auth.isFillAllowed)

router
  .route('/auth/signup/code')
  .post(user.Auth.verifyCode)

router.post(
  '/auth/signup/fill',
  imageUpload.single('avatar_src'),
  imageCompression(false),
  user.Auth.fillInfo
)

router.post('/promo', user.Auth.Promo.getStatus)

module.exports = router
