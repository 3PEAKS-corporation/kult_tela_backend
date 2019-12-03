const nodemailer = require('nodemailer')
const { env } = require('../config/')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: env.EMAIL,
         pass: env.EMAIL_PASSWORD
     }
 });

/*
function debug(info) {
  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: 'artglz63@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?sss', // plain text body
    html: '<b>Hello world?</b>' // html body
  })

  //debug(info)
}*/

const mailOptions = (email ,code) => {
  return {
    from: 'kulttela@info.ru', // sender address
    to: email, // list of receivers
    subject: 'Subject of your email', // Subject line
    html: code// plain text body
  }
};

const sendEmail = (email ,code) => {
  transporter.sendMail(mailOptions(email, code), (err, info) => {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}

module.exports = sendEmail
