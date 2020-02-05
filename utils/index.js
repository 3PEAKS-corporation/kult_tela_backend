const Token = require('./user/Token')
const Common = require('./user/Common')
const Email = require('./user/Email')
const Food = require('./user/Food')
const Photo = require('./user/Photo')
const Payment = require('./user/Payment')
const Notification = require('./user/Notification')
const Chat = require('./user/Chat/')
const History = require('./user/History')
const Workout = require('./user/Workout')

module.exports = {
  User: {
    Token,
    Common,
    Email,
    Food,
    Photo,
    Payment,
    Notification,
    Chat,
    History,
    Workout
  }
}
