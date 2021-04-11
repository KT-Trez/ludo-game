const express = require('express');
const ccs = { // TODO: Fix ccs import
  beautifyTime(time) {
    function twoDigit(digit) {
      if (digit.toString().length == 1)
        return '0' + digit;
      else
        return digit.toString();
    };
    return twoDigit(time.getHours()) + ':' + twoDigit(time.getMinutes()) + ':' + twoDigit(time.getSeconds());
  }
};


const events = express.Router();
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

    let clientId = new Date().getTime() + (Math.random() * 10).toFixed(0);
    while (lastRoom.clients.includes(client => client.id == clientId))
      clientId = new Date().getTime() + (Math.random() * 10).toFixed(0);

    const newClient = new Client(clientId, lastRoom.clients.length, 'temp', res);
    lastRoom.clients.push(newClient);

    const newclientsQuantity = lastRoom.clients.length;
    lastRoom.clientsQuantity = newclientsQuantity;
    if (newclientsQuantity == 4) {
      lastRoom.isFull = true;
      this.data.hasFreeRoom = false;
    }

    console.log(`${ccs.beautifyTime(new Date())} [INFO] Client [${clientId}] joined first free room [${lastRoom.id}].`); // DEBUG
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

  constructor() { // Konstruktor
    this.id = new Date().getTime() + (Math.random() * 1000).toFixed(0);
    this.clients = [];
    this.clientsQuantity = this.clients.length;
    this.isFull = this.clientsQuantity == 4 ? true : false;
  }
  create() { // Tworzy nowy pokój | Zwraca id utworzonego pokoju
    Room.list.push(this);
    Room.data.hasFreeRoom = true;

    console.log(`${ccs.beautifyTime(new Date())} [INFO] Created new room [${this.id}].`); // DEBUG
    return this.id;
  }
}
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


events.get('/connection', (req, res) => {
  const query = req.query;

  if (!query.room && !query.client) { // tworzenie sesji
    let joinedData;
    if (!Room.data.hasFreeRoom) {
      new Room().create();
      joinedData = Room.joinFirstFree(res);
    } else
      joinedData = Room.joinFirstFree(res);

    res.status(200).set({
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
    let resData = {
      data: joinedData,
      type: 'joined'
    };
    res.write('data: ' + JSON.stringify(resData) + '\n\n');
  } else { // ponowne dołączanie do sesji
    res.status(200).set({
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
    let resData = {
      data: {
        info: null,
        status: null
      },
      type: 'rejoin'
    };

    const room = Room.list.find(room => room.id == query.room);
    if (!room) {
      resData.data.info = `Pokój ${query.room} nie istnieje.`;
      resData.data.status = false;
      res.end('data: ' + JSON.stringify(resData) + '\n\n');
      console.log(`${ccs.beautifyTime(new Date())} [INFO] Client [${query.client}] failed to rejoin [${query.room}].`);
    } else {
      const client = room.clients.find(client => client.id == query.client);
      if (client) {
        client.res = res;
        resData.data.status = true;
        res.write('data: ' + JSON.stringify(resData) + '\n\n');
        console.log(`${ccs.beautifyTime(new Date())} [INFO] Client [${query.client}] rejoined [${query.room}].`);
      } else {
        resData.data.info = `Klient ${query.client} nie istenieje w pokju ${query.room}.`;
        resData.data.status = false;
        res.end('data: ' + JSON.stringify(resData) + '\n\n');
        console.log(`${ccs.beautifyTime(new Date())} [INFO] Client [${query.client}] failed to rejoin [${query.room}].`);
      }
    }
  };
  console.log('-------------------------');
  console.log(Room.list);
});

events.post('/checkSession', (req, res) => {
  req.on('data', data => {
    const reqData = JSON.parse(data);
    const room = Room.list.find(room => room.id == reqData.roomId);
    if (!room)
      res.sendStatus(204);
    else {
      const client = room.clients.find(client => client.id == reqData.clientId);
      if (!client)
        res.sendStatus(204);
      else
        res.sendStatus(200);
    };
  });
});

events.get('/ping', (req, res) => {
  console.log('xdxd');
  console.log(Room.list[0].clients);
  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });
  Room.list[0].clients[0].res.write('data: hyhyxd\n\n')
})

// setInterval(() => {
//   let data = {
//     message: 'Ohayou sekai!',
//     timestamp: Date.now()
//   }
//   // let testString = 'event: essa\n data: ' + JSON.stringify(data) + '\n\n';
//   let testString = 'data: ' + JSON.stringify(data) + '\n\n';
//
//   res.write(testString);
//   console.log('Sent', data);
// }, 2500);

/*
{
  room_id: String,
  clients: [
    {
      client_id: String,
      client_number: Number,
      color: String
      res
    }
  ],
  clientsQuantity: Number,
  is_full: boolean
}
*/


module.exports = events;