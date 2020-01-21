module.exports = new (function socks() {
  this.data = []

  this.add = function(user) {
    this.data.push(user)
  }

  this.remove = function(socket) {
    this.data = this.data.filter(user => user.socket !== socket)
  }

  this.isUser = function({ id, socket }) {
    let user
    if (id) user = this.data.filter(item => item.id === id)[0]
    if (socket) user = this.data.filter(item => item.socket === socket)[0]
    if (id && socket)
      user = this.data.filter(
        item => item.id === id && item.socket === socket
      )[0]
    return Boolean(user)
  }

  this.getUser = function({ id, socket }) {
    let user
    if (id) user = this.data.filter(item => item.id === id)[0]
    if (socket) user = this.data.filter(item => item.socket === socket)[0]
    if (id && socket)
      user = this.data.filter(
        item => item.id === id && item.socket === socket
      )[0]
    return user
  }
})()
