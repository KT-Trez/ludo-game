const express = require('express');

const Game = require('../classes/Game.js');
const Client = require('../classes/Client.js');
const Room = require('../classes/Room.js');
const Utils = require('../components/utils');

const router = express.Router();


router.get('/join', (req, res) => {
  console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] New player joining first free room.` + Utils.logLevelBg('end'));
  let player = new Client(req.query.nick);
  res.send(player);
  console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] New player (${player.id}) joined first free room (${player.room}).` + Utils.logLevelBg('end'));
});

router.post('/lobby', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);

    let room = Room.list.find(room => room.id == reqData.room);
    if (room) {
      let resData = {
        forceStart: room.forceStart,
        players: []
      };
      room.clients.forEach(client => resData.players.push(Client.createSecretClient(client, reqData)));

      res.send(JSON.stringify(resData));
    } else
      res.sendStatus(404);
  });
});

router.post('/lobbyStart', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);

    let room = Room.list.find(room => room.id == reqData.room);
    if (room) {
      let player = room.clients.find(player => player.id == reqData.id);
      if (player) {
        player.forceStart = reqData.state ? true : false;

        room.forceStart = 0;
        room.clients.forEach(player => player.forceStart ? room.forceStart++ : null);

        if (room.forceStart > 1 && room.forceStart == room.clients.length) {
          console.log(Utils.logLevelBg(0) + `${Utils.fullTimeAndDate(new Date())} [INFO] Starting game ${room.id}.` + Utils.logLevelBg('end'));
          Room.data.hasFreeRoom = false;
          new Game(room).play();
        };

        res.sendStatus(200);
      } else
        res.sendStatus(404);
    } else
      res.sendStatus(404);
  });
});

router.post('/rejoin', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);
    console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] Rejoining ${reqData.room} as ${reqData.id}.` + Utils.logLevelBg('end'));

    let room = Room.list.find(room => room.id == reqData.room);
    if (room) {
      let player = room.clients.find(player => player.id == reqData.id);
      if (player) {
        res.sendStatus(200);
        console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Rejoined ${reqData.room} as ${reqData.id}.` + Utils.logLevelBg('end'));
      } else {
        res.sendStatus(404);
        console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to rejoin ${reqData.room} as ${reqData.id} (No existing player).` + Utils.logLevelBg('end'));
      };
    } else {
      res.sendStatus(404);
      console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to rejoin ${reqData.room} as ${reqData.id} (No existing room).` + Utils.logLevelBg('end'));
    };
  });
});


module.exports = {
  router
};