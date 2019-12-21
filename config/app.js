const express = require('express')
const path = require('path')
const cors = require('cors')

module.exports = function() {
  let app = express(),
    create,
    start

  create = config => {
    const router = require('../routes/')
    const { initData: initJsonData } = require('../data/')
    const { env } = require('./')

    app.set('env', config.ENV)
    app.set('port', config.PORT)

    app.use(cors())
    app.use(express.json())
    app.use(
      env.IMAGES_FOLDER,
      express.static(process.cwd() + env.IMAGES_FOLDER)
    )

    router.init(app)

    initJsonData()

    app.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Requested-With')
      next()
    })
  }

  start = () => {
    const port = app.get('port')

    app.get('/', (req, res) => {
      res.status(200).send({ report: 'Server works properly.' })
    })

    app.listen(port, () => {
      console.log('Express server listening on - http://localhost:' + port)
    })
  }

  return {
    create,
    start
  }
}
