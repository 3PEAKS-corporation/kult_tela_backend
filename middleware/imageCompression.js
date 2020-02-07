const gm = require('gm')
const { env } = require('../config/')

function imageCompression(array = false) {
  return function(req, res, next) {
    if (req.file || req.files) {
      if (array === false) {
        const filename = req.file.filename
        gm('.' + env.IMAGES_FOLDER + '/' + filename)
          .quality(60)
          .autoOrient()
          .compress('JPEG')
          .write('.' + env.IMAGES_FOLDER + '/' + filename, err => {
            if (err) console.log(err)
          })
      } else {
        let res = true
        req.files.forEach(file => {
          const filename = file.filename
          gm('.' + env.IMAGES_FOLDER + '/' + filename)
            .quality(60)
            .autoOrient()
            .compress('JPEG')
            .write('.' + env.IMAGES_FOLDER + '/' + filename, err => {
              if (err) console.log(err)
            })
        })
      }
    }
    next()
  }
}

module.exports = imageCompression
