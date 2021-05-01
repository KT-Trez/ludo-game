const Game = require('../classes/Game.js');
const Room = require('../classes/Room.js');

const Utils = require('../components/utils');

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

      if (room.clients.length == 4) {
        Room.data.hasFreeRoom = false;
        new Game(room).play();
        console.log(Utils.logLevelBg(0) + `${Utils.fullTimeAndDate(new Date())} [INFO] Starting game ${room.id}.` + Utils.logLevelBg('end'));
      };

      return this;
    };
  }

  static createSecretClient(client, reqData) {
    return {
      color: client.color,
      forceStart: client.forceStart,
      id: client.id == reqData.id ? client.id : null,
      nick: client.nick,
      room: client.room
    };
  }

}