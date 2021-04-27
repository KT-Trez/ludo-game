const express = require('express');
const Utils = require('../src/utils');
const game = require('../src/game');

const router = express.Router();


router.get('/fillRoom', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Filling room with 4 players.` + Utils.logLevelFg('end'));
  for (var i = 0; i < 4; i++)
    new game.Player('Player ' + i);
  res.sendStatus(200);
});

router.get('/listRoom', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Listing all rooms.` + Utils.logLevelFg('end'));
  console.log(game.Room.list);
  res.sendStatus(200);
});


module.exports = {
  router
};