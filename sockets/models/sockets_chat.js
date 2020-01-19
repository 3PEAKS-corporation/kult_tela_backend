module.exports = new (function socks() {
  this.data = []

  this.add = function(user) {
    this.data.push(user)
  }

  this.remove = function(socket) {
    this.data = this.data.filter(user => user.socket !== socket)
  }
})()
