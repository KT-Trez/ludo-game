const Utils = require('./utils');


class Player {

  static data = {
    colors: ['red', 'blue', 'green', 'yellow']
  }

  constructor(nick) {
    this.forceStart = false;
    this.id = new Date().getTime() + Math.random() * 1000;
    this.nick = nick;
    this.room = Room.joinFree();

    let room = Room.list.find(room => room.id == this.room);
    if (room) {
      room.players.push(this);
      this.color = Player.data.colors[room.players.length - 1]

      if (room.players.length == 4)
        Room.data.hasFreeRoom = false;

      // console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] Player  ${this.id} joined ${room.id}`);
      return this;
    };
  }
}

class Game {
  constructor() {

  }

  start() {
    console.log('Starting game!');
  }
}

class Room {
  static data = {
    hasFreeRoom: false
  };
  static list = [];

  static joinFree() {
    if (this.data.hasFreeRoom)
      return this.list[this.list.length - 1].id;
    else
      return new Room().create();
  }

  constructor() {
    this.forceStart = 0;
    this.id = new Date().getTime() + Math.random() * 1000;
    this.isFree = true;
    this.players = [];
  }

  create() {
    Room.list.push(this);
    Room.data.hasFreeRoom = true;
    // console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] Created new room:`, this);
    return this.id;
  }

}


module.exports = {
  Game,
  Player,
  Room
}