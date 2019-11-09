const { Router } = require('express')
const { Auth } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()
router
  .route('/auth')
  .post(Auth.login)
  .get(requireAuth, Auth.userByToken)

router
  .route('/auth-signup')
  .put(Auth.createBlankProfile)
  .post(Auth.isFillAllowed)

router.post(
  '/auth-signup/fill',
  imageUpload.single('avatar_src'),
  Auth.fillInfo
)

module.exports = router
