const utils = require('./utils');


class Client { // klasa reprezentująca klienta gry
  // constructor Client
  color; // String
  id; // String
  number; // Number
  pawns; // Object<Pawn>
  res; // Object<ServerResponse>

  constructor(id, number, color, res) {
    this.color = color;
    this.id = id;
    this.number = number;
    this.pawns = {
      pawn0: 'h',
      pawn1: 'h',
      pawn2: 'h',
      pawn3: 'h'
    };
    this.res = res;
  }
}

class Game { // klasa reprezentująca grę
  constructor() {

  }
}

class Room { // klasa reprezentująca pokój do gry
  // statyczny Room
  static data = {
    hasFreeRoom: false // Boolean
  };
  static list = []; // Array<Room>

  // constructor Room
  id; // String
  clients; // Array<Client>
  clientsQuantity; // Number
  isFull; // Boolean

  static joinFirstFree(res) { // Dołącza klienta do pierwszego wolnego pokoju | Zwraca id dołączonego pokoju oraz id clienta
    const lastRoom = this.list[this.list.length - 1];

    let clientId = new Date().getTime() + (Math.random() * 10).toFixed(0); // generowanie nowego id dla klienta
    while (lastRoom.clients.includes(client => client.id == clientId))
      clientId = new Date().getTime() + (Math.random() * 10).toFixed(0);

    const newClient = new Client(clientId, lastRoom.clients.length, 'temp', res); // generowanie nowego klienta

    lastRoom.clients.push(newClient); // dodawanie klienta do pokoju oraz aktualizowanie informacji o pokoju
    this.updateRoomInfo(lastRoom);

    console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] [INFO] Client [${clientId}] joined first free room [${lastRoom.id}].`); // DEBUG
    return {
      room: {
        id: lastRoom.id
      },
      client: {
        id: newClient.id,
        number: newClient.number,
        color: newClient.color
      }
    };
  }

  static updateRoomInfo(updatingRoom) { // Aktualizuje informacje o pokoju
    const newclientsQuantity = updatingRoom.clients.length;
    updatingRoom.clientsQuantity = newclientsQuantity;
    if (newclientsQuantity == 4) {
      updatingRoom.isFull = true;
      this.data.hasFreeRoom = false;
    };
  }

  constructor() { // Konstruktor
    this.id = new Date().getTime() + (Math.random() * 1000).toFixed(0);
    this.clients = [];
    this.clientsQuantity = this.clients.length;
    this.isFull = this.clientsQuantity == 4 ? true : false;
  }
  create() { // Tworzy nowy pokój | Zwraca id utworzonego pokoju
    Room.list.push(this);
    Room.data.hasFreeRoom = true;

    console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] [INFO] Created new room [${this.id}].`); // DEBUG
    return this.id;
  }
}


module.exports = {
  Room,
  Client
}