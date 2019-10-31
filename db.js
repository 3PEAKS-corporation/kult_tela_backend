const { query, pool } = require('./services/db')
const fs = require('fs')

const MODELS = ['users', 'tokens', 'signup_info', 'plans', 'functions']

const rf = name => fs.readFileSync('./models/' + name).toString()

const createTables = () => {
  let queryText = ''
  MODELS.forEach(model => {
    queryText += rf(model + '.sql')
  })

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
  let queryText = ''
  MODELS.forEach(table => (queryText += `DROP TABLE IF EXISTS ${table};`))
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
