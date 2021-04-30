module.exports = class Move {

  constructor(action, pawn, room) {
    this.action = action;
    this.id = room.avaliableMoves.length;
    this.pawn = pawn.id;
    this.square = {
      new: null,
      old: null
    };

    switch (action) {

      case 'finish':
        Object.assign(this.square, {
          new: 'f' + room.player.current.color[0] + (pawn.square + room.roll) % room.board.squareCount,
          old: pawn.square
        });
        break;
      case 'move':
        Object.assign(this.square, {
          new: (pawn.square + room.roll) % room.board.squareCount,
          old: pawn.square
        });
        break;
      case 'start':
        this.square.new = room.player.current.start;
        break;
    }
  }

}