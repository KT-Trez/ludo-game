const Move = require('./Move.js');
const Player = require('./Player.js');

const Utils = require('../components/utils');

module.exports = class Game {
  static data = {}
  static list = [];

  static roll() {
    let min = Math.ceil(1);
    let max = Math.floor(6);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  constructor(room) {
    this.avaliableMoves = [];
    this.board = {
      squareCount: 40,
      players: []
    };
    this.hasEnded = false;
    this.map = [];
    this.player = {
      count: 0,
      current: null
    };
    this.roll = null;
    this.room = room;
    this.timer = new Date().getTime() + 60000;
    this.timeout = null;
    this.skippable = false;
    this.winner = null;

    for (let i = 0; i < room.clients.length; i++)
      this.board.players.push(new Player(room.clients[i], i));
    Game.list.push(this);
  }

  checkForWin() {
    this.board.players.forEach(player => {
      if (player.finishedPawns == player.pawns.length) {
        this.hasEnded = true;
        this.winner = player;
        console.log('Winner found!');
      };
    });
    console.log(this);
    console.log(Utils.logLevelBg(0) + `${Utils.fullTimeAndDate(new Date())} [INFO] Game ${this.room.id} has ended.` + Utils.logLevelBg('end'));
  }

  createMoves() {
    this.avaliableMoves = [];

    let finishSquares = this.player.current.finish;
    this.player.current.pawns.forEach(pawn => {
      if (this.roll == 1 || this.roll == 6) {
        let isHomeSquareAllied = this.map.find(anyPawn => anyPawn.square == this.player.current.start);

        if (
          (pawn.state == 'home' && !isHomeSquareAllied) ||
          (pawn.state == 'home' && isHomeSquareAllied.player != this.player.current.id)
        )
          this.avaliableMoves.push(new Move('start', pawn, this));
      };

      if (finishSquares.find(square => square == (pawn.square + this.roll) % this.board.squareCount) && (pawn.square <= this.player.current.start || pawn.square - this.roll < 0) && !pawn.hasStarted) {
        let isFinishSquareAllied = this.map.find(anyPawn => anyPawn.square == 'f' + this.player.current.color[0] + (pawn.square + this.roll) % this.board.squareCount);

        if (pawn.state == 'board' && !isFinishSquareAllied) {
          this.avaliableMoves.push(new Move('finish', pawn, this));
          this.skippable = this.player.current.finishedPawns == this.player.current.pawns.length - 1 ? true : false;
        };
      };

      let isNextSquareAllied = this.map.find(anyPawn => anyPawn.square == (pawn.square + this.roll) % this.board.squareCount);

      if (
        (pawn.state == 'board' && !isNextSquareAllied) ||
        (pawn.state == 'board' && isNextSquareAllied.player != this.player.current.id)
      )
        this.avaliableMoves.push(new Move('move', pawn, this));
    });
    this.skippable = this.avaliableMoves.length == 0 ? true : false;
  }

  nextTurn() {
    this.player.count++;
    this.player.count = this.player.count % this.board.players.length;
    this.timer = new Date().getTime() + 60000;
    this.skippable = false;
    if (!this.hasEnded) this.play();
  }

  play() {
    this.player.current = this.board.players[this.player.count];
    this.roll = Game.roll();

    this.createMoves();

    this.timeout = setTimeout(() => this.nextTurn(), 60000);
  }

  registerMove(moveId) {
    clearTimeout(this.timeout);
    if (this.hasEnded) return;

    let move = this.avaliableMoves.find(move => move.id == moveId);
    let movingPawn = this.player.current.pawns.find(pawn => pawn.id == move.pawn);

    if (move.action == 'start') {
      killPawn(this);
      Object.assign(movingPawn, {
        state: 'board',
        square: move.square.new
      });
      this.map.push(movingPawn);
    } else if (move.action == 'move') {
      killPawn(this);
      Object.assign(movingPawn, {
        state: 'board',
        hasStarted: false,
        square: move.square.new
      });
    } else if (move.action == 'finish') {
      this.player.current.finishedPawns++;
      Object.assign(movingPawn, {
        state: 'finish',
        square: move.square.new
      });
      let finishSquare = this.player.current.finish.find(square => square == parseInt(move.square.new.slice(2, move.square.new.length)));
      this.player.current.finish.splice(this.player.current.finish.indexOf(finishSquare), 1);

      this.checkForWin();
    };

    function killPawn(thisGame) {
      let enemyPawn = thisGame.map.find(pawn => pawn.square == move.square.new % thisGame.board.squareCount);
      if (enemyPawn) {
        Object.assign(enemyPawn, {
          state: 'home',
          hasStarted: true,
          square: null
        });
        thisGame.map.splice(thisGame.map.indexOf(enemyPawn), 1);
      };
    };

    this.nextTurn();
  }

  registerSkip() {
    clearTimeout(this.timeout);
    if (this.hasEnded) return;
    this.nextTurn();
  }

}