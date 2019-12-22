const nodemailer = require('nodemailer')
const { env } = require('../config/')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSWORD
  }
})

const mailOptions = (email, opts) => {
  return {
    from: 'info@cultTela.ru', // sender address
    to: email, // list of receivers
    ...opts
  }
}

const sendEmail = (email, opts) => {
  transporter.sendMail(mailOptions(email, opts), (err, info) => {
    if (err) console.log(err)
    else console.log(info)
  })
}

module.exports = sendEmail
