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
  }
}
