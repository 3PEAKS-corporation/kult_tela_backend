const multer = require('multer')
const { env } = require('../config')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.' + env.IMAGES_FOLDER)
  },
  filename: (req, file, cb) => {
    const date = new Date()
    let name = `${req.currentUser &&
      req.currentUser.id}-${date.getDate()}-${date.getMonth() +
      1}-${date.getFullYear()}-${date.getSeconds()}-${file.originalname.replace(
      /\s/g,
      ''
    )}`
    cb(null, name)
  }
})

const upload = multer({
  storage
})

module.exports = upload
