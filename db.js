const { query, pool } = require('./services/db')

const fs = require('fs')

const rf = name => fs.readFileSync('./models/' + name).toString()

const usersInit = rf('users.sql')

const createTables = () => {
  const queryText = usersInit
  query(queryText)
    .then(res => {
      console.log(res)
      pool.end()
    })
    .catch(err => {
      console.log(err)
      pool.end()
    })
}

const dropTables = () => {
  const tablesToDrop = [
    'tokens',
    'users',
    'workers',
    'promos',
    'gallery',
    'requests',
    'reviews'
  ]
  let queryText = ''
  tablesToDrop.forEach(table => (queryText += `DROP TABLE IF EXISTS ${table};`))
  console.log(queryText)

  query(queryText)
    .then(res => {
      console.log(res)
      pool.end()
    })
    .catch(err => {
      console.log(err)
      pool.end()
    })
}

module.exports = { createTables, dropTables }

require('make-runnable')
