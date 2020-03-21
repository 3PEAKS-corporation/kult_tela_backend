const dotenv = require('dotenv').config()

const env = process.env

module.exports = {
  DATABASE_URL: env.DATABASE_URL,
  SECRET: env.SECRET,
  ADMIN_SECRET: env.ADMIN_SECRET,
  SUPERADMIN_SECRET: env.SUPERADMIN_SECRET,
  PORT: env.PORT,
  ENV: env.ENV,
  IMAGES_FOLDER: '/public/images',
  EMAIL: env.EMAIL,
  EMAIL_PASSWORD: env.EMAIL_PASSWORD,
  SERVER_URL: env.SERVER_URL,
  SITE_URL: env.SITE_URL,
  ADMIN_URL: env.ADMIN_URL,
  KASSA_ID: env.KASSA_ID,
  KASSA_KEY: env.KASSA_KEY
}
