const Move = require('./Move.js');
const Player = require('./Player.js');

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
    this.map = [];
    this.player = {
      count: 0,
      current: null
    };
    this.roll = null;
    this.room = room;
    this.timeout = null;

    for (let i = 0; i < room.clients.length; i++)
      this.board.players.push(new Player(room.clients[i], i));
    Game.list.push(this);
  }

  createMoves() {
    this.avaliableMoves = [];

    let finishSquares = this.player.current.finish;
    let moveId = 0;
    this.player.current.pawns.forEach(pawn => {
      let move = {
        action: null,
        id: moveId,
        pawn: pawn.id,
        square: {
          new: null,
          old: null
        }
      };

      if (this.roll == 1 || this.roll == 6) {
        let isHomeSquareAllied = this.map.find(anyPawn => anyPawn.square == this.player.current.start);

        if (
          (pawn.state == 'home' && !isHomeSquareAllied) ||
          (pawn.state == 'home' && isHomeSquareAllied.player != this.player.current.id)
        )
          this.avaliableMoves.push(new Move('start', pawn, this));
      };

      if (finishSquares.find(square => square == (pawn.square + this.roll) % this.board.squareCount) && !pawn.hasStarted) {
        let isFinishSquareAllied = this.map.find(anyPawn => anyPawn.square == 'f' + (pawn.square + this.roll) % this.board.squareCount);

        if (pawn.state == 'board' && !isFinishSquareAllied)
          this.avaliableMoves.push(new Move('finish', pawn, this));
      };

      let isNextSquareAllied = this.map.find(anyPawn => anyPawn.square == (pawn.square + this.roll) % this.board.squareCount);

      if (
        (pawn.state == 'board' && !isNextSquareAllied) ||
        (pawn.state == 'board' && isNextSquareAllied.player != this.player.current.id)
      )
        this.avaliableMoves.push(new Move('move', pawn, this));
    });
    console.log(this.roll);
    console.log(this.avaliableMoves);
  }

  play() {
    this.player.current = this.board.players[this.player.count];
    this.roll = Game.roll();

    this.createMoves();

    this.timeout = setTimeout(() => {
      this.player.count++;
      this.player.count = this.player.count % this.board.players.length;
      this.play();
    }, 60000);
  }

  registerMove(moveId) {
    clearTimeout(this.timeout);
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
      Object.assign(movingPawn, {
        state: 'finish',
        square: move.square.new
      });
      let finishSquare = this.player.current.finish.find(square => square == move.square.new);
      this.player.current.finish.splice(this.map.indexOf(finishSquare), 1);
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

    this.player.count++; // wznawianie gry
    this.player.count = this.player.count % this.board.players.length;
    this.play();
  }

}