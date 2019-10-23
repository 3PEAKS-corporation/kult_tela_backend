const { Pool } = require('pg')
const dbconfig = require('../config/db')

const pool = new Pool({
  connectionString: dbconfig.DATABASE_URL
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
  }
}
