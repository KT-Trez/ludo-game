const Room = require('../classes/Room.js');

module.exports = class Client {

  static data = {
    colors: ['red', 'blue', 'green', 'yellow']
  }

  constructor(nick) {
    this.forceStart = false;
    this.id = new Date().getTime() + Math.random() * 1000;
    this.nick = encodeURIComponent(nick);
    this.room = Room.joinFree();

    let room = Room.list.find(room => room.id == this.room);
    if (room) {
      room.clients.push(this);
      this.color = Client.data.colors[room.clients.length - 1]

      if (room.clients.length == 4)
        Room.data.hasFreeRoom = false;

      return this;
    };
  }

}