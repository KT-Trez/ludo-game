const express = require('express');

const Game = require('../classes/Game.js');
const Utils = require('../components/utils');

const router = express.Router();


router.post('/boardUpdate', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);
    console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] Geting board update of ${reqData.room} for ${reqData.id}.` + Utils.logLevelBg('end'));

    let game = Game.list.find(game => game.room.id == reqData.room);
    if (game) {
      let player = game.room.clients.find(player => player.id == reqData.id);
      if (player) {
        let resData = {
          nick: game.room.clients.find(client => client.id == game.player.current.id).nick,
          pawns: [],
          player: game.player.current.color,
          roll: game.roll,
          timers: {
            move: game.timer,
            room: game.room.timer
          },
        };
        for (var i = 0; i < game.board.players.length; i++)
          game.board.players[i].pawns.forEach(pawn => resData.pawns.push({
            id: pawn.id,
            player: game.board.players[i].color,
            state: pawn.state,
            square: pawn.square
          }));

        if (game.hasEnded) {
          resData.type = 'ended';
          resData.winner = {
            color: game.winner.color,
            nick: game.room.clients.find(client => client.id == game.winner.id).nick
          };
          res.send(JSON.stringify(resData));
          console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Updated board ${reqData.room} for ${reqData.id}.` + Utils.logLevelBg('end'));
        } else if (game.player.current.id == reqData.id) {
          resData.avaliableMoves = game.avaliableMoves;
          resData.skippable = game.skippable;
          resData.type = 'read_write';
          res.send(JSON.stringify(resData));
          console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Updated board ${reqData.room} for current ${reqData.id}.` + Utils.logLevelBg('end'));
        } else {
          resData.type = 'read'
          res.send(JSON.stringify(resData));
          console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Updated board ${reqData.room} for ${reqData.id}.` + Utils.logLevelBg('end'));
        };
      } else {
        res.sendStatus(404);
        console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to get board update of ${reqData.room} for ${reqData.id} (No existing player).` + Utils.logLevelBg('end'));
      };
    } else {
      res.sendStatus(404);
      console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to get board update of ${reqData.room} for ${reqData.id} (No existing room).` + Utils.logLevelBg('end'));
    };
  });
});

router.post('/getClients', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);
    console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] Getting players of ${reqData.room} for ${reqData.id}.` + Utils.logLevelBg('end'));

    let game = Game.list.find(game => game.room.id == reqData.room);
    if (game) {
      let resData = [];
      game.room.clients.forEach(client => {
        resData.push({
          color: client.color,
          nick: client.nick
        });
      });
      res.send(JSON.stringify(resData));
      console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Got players of ${reqData.room} for ${reqData.id}.` + Utils.logLevelBg('end'));
    } else {
      res.sendStatus(404);
      console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to get players of ${reqData.room} for ${reqData.id} (No existing room).` + Utils.logLevelBg('end'));
    };
  });
});

router.post('/registerMove', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);
    console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] Registration of move ${reqData.moveId} in ${reqData.room} by ${reqData.id}.` + Utils.logLevelBg('end'));

    let game = Game.list.find(game => game.room.id == reqData.room);
    if (game) {
      let player = game.room.clients.find(player => player.id == reqData.id);
      if (player) {
        if (game.player.current.id == reqData.id && game.avaliableMoves.find(move => move.id == reqData.moveId)) {
          game.registerMove(reqData.moveId);
          res.sendStatus(200);
          console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Registred move ${reqData.moveId} in ${reqData.room} by ${reqData.id}.` + Utils.logLevelBg('end'));
        } else {
          res.sendStatus(404);
          console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register move ${reqData.moveId} in ${reqData.room} by ${reqData.id} (Invalid turn or move id).` + Utils.logLevelBg('end'));
        };
      } else {
        res.sendStatus(404);
        console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register move ${reqData.moveId} in ${reqData.room} by ${reqData.id} (No existing player).` + Utils.logLevelBg('end'));
      };
    } else {
      res.sendStatus(404);
      console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register move ${reqData.moveId} in ${reqData.room} by ${reqData.id} (No existing room).` + Utils.logLevelBg('end'));
    };
  });
});

router.post('/registerSkip', (req, res) => {
  req.on('data', data => {
    let reqData = JSON.parse(data);
    console.log(Utils.logLevelBg(1) + `${Utils.fullTimeAndDate(new Date())} [WORKING] Registration of skip in ${reqData.room} by ${reqData.id}.` + Utils.logLevelBg('end'));

    let game = Game.list.find(game => game.room.id == reqData.room);
    if (game) {
      let player = game.room.clients.find(player => player.id == reqData.id);
      if (player) {
        if (game.player.current.id == reqData.id && game.skippable) {
          game.registerSkip();
          res.sendStatus(200);
          console.log(Utils.logLevelBg(2) + `${Utils.fullTimeAndDate(new Date())} [SUCCESS] Registred skip in ${reqData.room} by ${reqData.id}.` + Utils.logLevelBg('end'));
        } else {
          res.sendStatus(404);
          console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register skip in ${reqData.room} by ${reqData.id} (Invalid turn).` + Utils.logLevelBg('end'));
        };
      } else {
        res.sendStatus(404);
        console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register skip in ${reqData.room} by ${reqData.id} (No existing player).` + Utils.logLevelBg('end'));
      };
    } else {
      res.sendStatus(404);
      console.log(Utils.logLevelBg(4) + `${Utils.fullTimeAndDate(new Date())} [ERROR] Failed to register skip in ${reqData.room} by ${reqData.id} (No existing room).` + Utils.logLevelBg('end'));
    };
  });
});


module.exports = {
  router
};