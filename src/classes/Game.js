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

  createMoves(pawnsPossibleToMove) {
    this.avaliableMoves = [];

    pawnsPossibleToMove.forEach((pawn, i) => {
      let move = {
        action: null,
        id: i,
        pawn: pawn.id,
        square: {
          new: null,
          old: null
        }
      };

      let finishSquares = this.player.current.finish;
      if (pawn.state == 'home') {
        move.action = 'start';
        move.square.new = this.player.current.start;
      } else {
        if (finishSquares.find(square => square == pawn.square + this.roll) && pawn.round > 0)
          move.action = 'finish';
        else
          move.action = 'move';
        Object.assign(move.square, {
          new: pawn.square + this.roll,
          old: pawn.square
        });
      };
      this.avaliableMoves.push(move);
    });
    console.log(this);
    console.log(this.avaliableMoves);
  }

  play() {
    this.player.current = this.board.players[this.player.count];
    this.roll = Game.roll();

    let pawnsPossibleToMove = [];
    if (this.roll == 1 || this.roll == 6)
      this.player.current.pawns.forEach(pawn => {
        let next = this.map.find(pawn => pawn.square == this.player.start);

        if (pawn.state == 'home' && !next)
          pawnsPossibleToMove.push(pawn);
        else if (pawn.state == 'home' && next && next.player != this.player.current.id)
          pawnsPossibleToMove.push(pawn);
      });
    this.player.current.pawns.forEach(pawn => {
      let next = this.map.find(pawn => pawn.square == pawn.square + this.roll);

      if (pawn.state == 'board' && !next)
        pawnsPossibleToMove.push(pawn);
      else if (pawn.state == 'board' && next.player != this.player.current.id)
        pawnsPossibleToMove.push(pawn);
    });

    this.createMoves(pawnsPossibleToMove);

    this.timeout = setTimeout(() => {
      this.player.count++;
      this.player.count = this.player.count % this.board.players.length;
      this.play();
    }, 10000);
  }

  registerMove(moveId) {
    clearTimeout(this.timeout);
    let move = this.avaliableMoves.find(move => move.id == moveId);
    let movingPawn = this.player.current.pawns.find(pawn => pawn.id == move.pawn);

    if (move.action == 'start') {
      killPawn(this);
      Object.assign(movingPawn, {
        state: 'board',
        round: 0,
        square: move.square.new
      });
      this.map.push(movingPawn);
    } else if (move.action == 'move') {
      killPawn(this);
      if (move.now > this.board.squareCount) {
        Object.assign(movingPawn, {
          state: 'board',
          round: movingPawn.round++,
          square: move.square.new % this.board.squareCount
        });
      } else {
        Object.assign(movingPawn, {
          state: 'board',
          square: move.square.new
        });
      };
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
          round: 0,
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