const express = require('express');
const game = require('../src/game');
const utils = require('../src/utils');

const router = express.Router();


router.get('/connection', (req, res) => {
  const query = req.query;

  if (!query.room && !query.client) { // tworzenie sesji - pokoju
    if (!game.Room.data.hasFreeRoom) // sprawdzanie czy istnieje wolny pokój i tworzenie nowego w razie potrzeby
      new game.Room().create();
    let joinedRoomId = game.Room.joinFirstFree(res); // dołączenie do pierwszego wolnego pokoju :String<RoomId>

    res.status(200).set({
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
    let resData = { // dane odpowiedzi
      data: joinedRoomId,
      type: 'joined'
    };
    res.write('data: ' + JSON.stringify(resData) + '\n\n');
  } else { // ponowne dołączanie do sesji - pokoju
    res.status(200).set({ // ustawianie nagłówka
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
    let resData = { // dane odpowiedzi
      data: {
        info: null,
        status: null
      },
      type: 'rejoin'
    };

    const room = game.Room.list.find(room => room.id == query.room); // sprawdzanie czy istnieje pokój o danym id
    if (!room) { // odpowiedź, gdy nie istnieje pokój o danym id
      resData.data.info = `Pokój ${query.room} nie istnieje.`;
      resData.data.status = false;
      res.end('data: ' + JSON.stringify(resData) + '\n\n');
      console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] [INFO] Client [${query.client}] failed to rejoin [${query.room}].`);
    } else {
      const client = room.clients.find(client => client.id == query.client); // sprawdzanie czy istnieje użytkown o danym id
      if (client) { // odpowiedź, gdy istnieje użytkownik o danym id
        client.res = res;
        resData.data.status = true;
        res.write('data: ' + JSON.stringify(resData) + '\n\n');
        console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] [INFO] Client [${query.client}] rejoined [${query.room}].`);
      } else { // odpowiedź, gdy nie istnieje użytkownik o danym id
        resData.data.info = `Klient ${query.client} nie istenieje w pokju ${query.room}.`;
        resData.data.status = false;
        res.end('data: ' + JSON.stringify(resData) + '\n\n');
        console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] [INFO] Client [${query.client}] failed to rejoin [${query.room}].`);
      }
    }
  };
  console.log('-------------------------');
  console.log(game.Room.list);
});

router.post('/checkSession', (req, res) => {
  req.on('data', data => {
    const reqData = JSON.parse(data);
    const room = game.Room.list.find(room => room.id == reqData.roomId);
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

router.get('/ping', (req, res) => {
  console.log('-------------------------');
  console.log(game.Room.list[0].clients);

  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });
  game.Room.list[0].clients[0].res.write('data: TextMessage\n\n');
});


module.exports = {
  router
};