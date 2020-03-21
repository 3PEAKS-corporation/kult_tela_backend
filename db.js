const { query, pool } = require('./services/db')
const fs = require('fs')

const MODELS = [
  'functions',

  'users',
  'tokens',
  'hashes',
  'chat_rooms',
  'chat_messages',
  'payments',
  'requests',
  'promo_codes'
]

const VIEWS = ['users_public']

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
  ;[...MODELS, ...VIEWS].forEach(model => {
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

  VIEWS.forEach(view => (queryText += `DROP VIEW IF EXISTS ${view};`))

  MODELS.forEach(table => (queryText += `DROP TABLE IF EXISTS ${table};`))

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

module.exports = {
  createTables,
  dropTables
}

require('make-runnable')
