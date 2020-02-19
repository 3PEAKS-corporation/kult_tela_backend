class UserWithSocket {
  constructor(id, socket, admin_role_id, plan_id) {
    this.id = id
    this.sockets = [socket]
    if (typeof admin_role_id === 'number') this.admin_role_id = admin_role_id
    if (typeof plan_id === 'number') this.plan_id = plan_id
  }

  appendSocket(socket) {
    this.sockets.push(socket)
  }

  emit(io) {
    io.to(this.sockets)
  }

  static getIndexInArray(array, id) {
    return array.map(e => e.id).indexOf(id)
  }
}

module.exports = new (function socks() {
  this.data = []

  this.add = function(id, socket, admin_role_id = null, plan_id = null) {
    const index = UserWithSocket.getIndexInArray(this.data, id)
    if (index !== -1) {
      this.data[index].appendSocket(socket)
    } else
      this.data.push(new UserWithSocket(id, socket, admin_role_id, plan_id))
  }

  this.remove = function(socket) {
    let i = 0
    for (const e of this.data) {
      if (e.sockets.includes(socket)) {
        this.data[i].sockets = this.data[i].sockets.filter(s => s !== socket)
        if (e.sockets.length === 0) this.data.splice(i, 1)
        break
      }
      i++
    }
  }

  this.isUser = function({ id = null, socket = null }) {
    let user
    if (id && !socket) user = this.data.filter(item => item.id === id)[0]
    else if (socket && !id)
      user = this.data.filter(item => item.sockets.includes(socket))[0]
    else if (id && socket) {
      user = this.data.filter(
        item => item.id === id && item.sockets.includes(socket)
      )[0]
    }
    return Boolean(user)
  }

  this.getUser = function({ id = null, socket = null }) {
    let user
    if (id && !socket) user = this.data.filter(item => item.id === id)[0]
    else if (socket && !id)
      user = this.data.filter(item => item.sockets.includes(socket))[0]
    else if (id && socket) {
      user = this.data.filter(
        item => item.id === id && item.sockets.includes(socket)
      )[0]
    }
    return user
  }
})()
