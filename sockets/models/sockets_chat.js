module.exports = new (function socks() {
  this.data = []

  this.add = function(user) {
    this.data.push(user)
  }

  this.remove = function(socket) {
    this.data = this.data.filter(user => user.socket !== socket)
  }

  this.isUser = function({ id = null, socket = null }) {
    let user
    if (id && !socket) user = this.data.filter(item => item.id === id)[0]
    else if (socket && !id)
      user = this.data.filter(item => item.socket === socket)[0]
    else if (id && socket) {
      user = this.data.filter(
        item => item.id === id && item.socket === socket
      )[0]
    }
    return Boolean(user)
  }

  this.getUser = function({ id = null, socket = null }) {
    let user
    if (id && !socket) user = this.data.filter(item => item.id === id)
    else if (socket && !id)
      user = this.data.filter(item => item.socket === socket)
    else if (id && socket) {
      user = this.data.filter(item => item.id === id && item.socket === socket)
    }
    return user
  }
})()
