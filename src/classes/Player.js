module.exports = class Player {

  constructor(client, clientNumber) {
    this.color = client.color;
    this.id = client.id;
    this.finish = [];
    this.finishedPawns = 0;
    this.pawns = [];
    this.start = clientNumber * 10;

    for (let i = 0; i < 4; i++) {
      this.pawns.push({
        id: i,
        player: this.id,
        movedSquares: 0,
        state: 'home',
        square: null
      });
      this.finish.push(this.start + i);
    };
  }

}