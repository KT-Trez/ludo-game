const express = require('express');

const Game = require('../classes/Game.js');
const Utils = require('../components/utils');

const router = express.Router();


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


module.exports = {
  router
};