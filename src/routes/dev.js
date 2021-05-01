const express = require('express');

const Client = require('../classes/Client.js');
const Game = require('../classes/Game.js');
const Room = require('../classes/Room.js');

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

router.get('/listGame', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Listing all games.` + Utils.logLevelFg('end'));
  console.log(Game.list);
  res.sendStatus(200);
});

router.get('/setDice', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Listing all games.` + Utils.logLevelFg('end'));
  if (req.query.number && typeof(req.query.number) == 'number') {
    Game.list[0].roll = number;
    Game.list[0].createMoves();
  };
  res.sendStatus(200);
});

router.get('/setWin', (req, res) => {
  console.log(Utils.logLevelFg(0) + `${Utils.fullTimeAndDate(new Date())} [DEV] Seting win for first player.` + Utils.logLevelFg('end'));
  let game = Game.list[0];
  let firstPlayer = game.board.players[0];

  game.player.count = 0;
  game.player.current = firstPlayer;
  game.roll = 1;
  this.skippable = true;

  firstPlayer.pawns.forEach((pawn, i) => {
    if (i < firstPlayer.pawns.length - 1)
      Object.assign(pawn, {
        hasStarted: false,
        state: 'finished',
        square: 'f' + firstPlayer.color[0] + firstPlayer.finish[i + 1]
      });
    else
      Object.assign(pawn, {
        hasStarted: false,
        state: 'board',
        square: firstPlayer.start
      });
    game.map.push(pawn);
  });
  firstPlayer.finish = [firstPlayer.finish[0]];
  firstPlayer.finishedPawns = 3;
  game.createMoves();

  res.sendStatus(200);
});


module.exports = {
  router
};