const { app, env } = require('./config/')

const App = app()

App.create(env)
App.start()
