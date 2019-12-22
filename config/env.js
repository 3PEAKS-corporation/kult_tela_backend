const dotenv = require('dotenv').config()

const env = process.env

module.exports = {
  DATABASE_URL: env.DATABASE_URL,
  SECRET: env.SECRET,
  PORT: env.PORT,
  ENV: env.ENV,
  IMAGES_FOLDER: '/public/images',
  EMAIL: env.EMAIL,
  EMAIL_PASSWORD: env.EMAIL_PASSWORD,
  URL: env.URL || 'http://localhost:3000/'
}
