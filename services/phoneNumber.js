const parsePhoneNumber = require('libphonenumber-js')

module.exports = {
  format: (v) => parsePhoneNumber(v, 'RU').format('E.164')
}
