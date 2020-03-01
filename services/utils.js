const { SERVER_URL, IMAGES_FOLDER } = require('../config/env')

module.exports = {
  response: {
    error: (res, error = 'Все поля должны быть заполнены!', code = 400) =>
      res.status(code).send({ success: false, error }),
    success: (res, message, code = 200) =>
      res.status(code).send({ success: true, data: message })
  },
  verify: body => {
    let isVerified = true
    body.forEach(item => {
      isVerified = isVerified && Boolean(typeof item == 'number' ? true : item)
    })
    return isVerified
  },
  getImageUrl: image_src => {
    const folder = IMAGES_FOLDER.substring(1)
    return image_src !== null ? SERVER_URL + folder + '/' + image_src : null
  },
  getCurrentDate: () => {
    const d = new Date()
    return `${
      d.getDate().toString().length === 1
        ? '0' + d.getDate().toString()
        : d.getDate()
    }.${
      d.getMonth().toString().length === 1
        ? '0' + (d.getMonth() + 1).toString()
        : d.getMonth()
    }.${d.getFullYear()}`
  }
}
