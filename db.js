const { query, pool } = require('./services/db')
const fs = require('fs')

const MODELS = [
  'functions',
  'users',
  'tokens',
  'signup_info',
  'plans',
  'exercises',
  'workouts'
]

const FUNCTIONS = ['arr_length', 'arr_last_item', 'calc_rank']

const rf = name => fs.readFileSync('./models/' + name).toString()

const createTables = () => {
  const dir = './public'
  const subdir = './public/images'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    if (!fs.existsSync(subdir)) fs.mkdirSync(subdir)
  }

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

  if (FUNCTIONS)
    FUNCTIONS.forEach(func => (queryText += `DROP FUNCTION IF EXISTS ${func};`))

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
