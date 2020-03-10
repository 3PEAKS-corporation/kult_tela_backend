const { Router } = require('express')
const { user } = require('../../controllers')
const {
  requireAuth,
  imageUpload,
  imageCompression
} = require('../../middleware')

const router = Router()

router.get('/chat', requireAuth.userToken(), user.Chat.getAll)
router.get('/chat/:user_id', requireAuth.userToken(), user.Chat.getById)
router.post(
  '/chat/image',
  requireAuth.userToken(),
  imageUpload.single('image_src'),
  imageCompression(false),
  user.Chat.uploadImage
)

module.exports = router
