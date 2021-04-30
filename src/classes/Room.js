const Game = require('../classes/Game.js');

const Utils = require('../components/utils');

module.exports = class Room {

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
    this.clients = [];
    this.forceStart = 0;
    this.id = new Date().getTime() + Math.random() * 1000;
    this.isFree = true;
    this.timer = new Date().getTime() + 18000000;
  }

  create() {
    Room.list.push(this);
    Room.data.hasFreeRoom = true;

    setTimeout(() => {
      Room.list.splice(Room.list.indexOf(this), 1);
      Game.list.splice(Game.list.indexOf(Game.list.find(game => game.room.id == this.id)), 1);
    }, 18000000);

    console.log(Utils.logLevelBg(0) + `${Utils.fullTimeAndDate(new Date())} [INFO] Created new room ${this.id}` + Utils.logLevelBg('end'));
    return this.id;
  }

}