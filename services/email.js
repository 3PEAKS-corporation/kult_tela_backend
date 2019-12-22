const nodemailer = require('nodemailer')
const { env } = require('../config/')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSWORD
  }
})

const mailOptions = (email, code) => {
  return {
    from: 'kulttela@info.ru', // sender address
    to: email, // list of receivers
    subject: 'Subject of your email', // Subject line
    html: code // plain text body
  }
}

const sendEmail = (email, body) => {
  transporter.sendMail(mailOptions(email, body), (err, info) => {
    if (err) console.log(err)
    else console.log(info)
  })
}

module.exports = sendEmail
