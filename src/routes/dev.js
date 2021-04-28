const express = require('express');

const Client = require('../classes/Client.js');
const Utils = require('../components/utils');

const router = express.Router();


router.get('/fillRoom', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Filling room with 4 players.` + Utils.logLevelFg('end'));
  for (var i = 0; i < 4; i++)
    new Client('Client ' + i);
  res.sendStatus(200);
});

router.get('/listRoom', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Listing all rooms.` + Utils.logLevelFg('end'));
  console.log(Room.list);
  res.sendStatus(200);
});


module.exports = {
  router
};