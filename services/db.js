const { Pool } = require('pg')
const { env } = require('../config/')

const pool = new Pool({
  connectionString: env.DATABASE_URL
})

module.exports = {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(text, params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  pool
}
