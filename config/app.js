const express = require('express')
const path = require('path')
const cors = require('cors')
const compression = require('compression')

module.exports = function() {
  let app = express(),
    create,
    start

  create = config => {
    const { initData: initJsonData } = require('../data/')
    const { env } = require('./')

    app.set('env', config.ENV)
    app.set('port', config.PORT)

    app.use(cors())
    app.use(compression())
    app.use(express.json())
    app.use(
      env.IMAGES_FOLDER,
      express.static(process.cwd() + env.IMAGES_FOLDER)
    )

    initJsonData()
  }

  start = () => {
    const port = app.get('port')

    app.get('/', (req, res) => {
      res.sendFile(path.resolve() + '/index.html')
    })

    const router = require('../routes/')
    router.init(app)

    const server = app.listen(port, () => {
      console.log('Express server listening on - http://localhost:' + port)
    })

    const io = require('socket.io').listen(server)

    const sockets = require('../sockets/')
    sockets.init(io)
  }

  return {
    create,
    start
  }
}
