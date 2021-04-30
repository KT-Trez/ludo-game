console.log('Loaded template: board.js');

import Utils from '../components/utils.js';

const lobby = { // eskportowany szablon planszy
  data: {
    loadBoard() {
      const boardMemory = [
        [null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, 'hr', 'hr', null, null, 0, 1, 2, null, null, 'hb', 'hb', null],
        [null, 'hr', 'hr', null, null, 39, 'fr1', 3, null, null, 'hb', 'hb', null],
        [null, null, null, null, null, 38, 'fr2', 4, null, null, null, null, null],
        [null, null, null, null, null, 37, 'fr3', 5, null, null, null, null, null],
        [null, 32, 33, 34, 35, 36, 'fr4', 6, 7, 8, 9, 10, null],
        [null, 31, 'fy31', 'fy32', 'fy33', 'fy34', null, 'fb14', 'fb13', 'fb12', 'fb11', 11, null],
        [null, 30, 29, 28, 27, 26, 'fg24', 16, 15, 14, 13, 12, null],
        [null, null, null, null, null, 25, 'fg23', 17, null, null, null, null, null],
        [null, null, null, null, null, 24, 'fg22', 18, null, null, null, null, null],
        [null, 'hy', 'hy', null, null, 23, 'fg21', 19, null, null, 'hg', 'hg', null],
        [null, 'hy', 'hy', null, null, 22, 21, 20, null, null, 'hg', 'hg', null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null],
      ];

      let board = document.getElementById('board');
      boardMemory.forEach(row => {
        let rowDom = document.createElement('tr');
        row.forEach(cell => {
          let cellDom = document.createElement('td');
          switch (typeof(cell)) {
            case 'number':
              cellDom.classList.add('square');
              cellDom.setAttribute('id', cell);
              break;
            case 'string':
              if (cell[0] == 'f')
                cellDom.setAttribute('id', cell);
              else
                cellDom.classList.add(cell, 'home');

              if (cell[1] == 'r')
                cellDom.classList.add('red');
              else if (cell[1] == 'b')
                cellDom.classList.add('blue');
              else if (cell[1] == 'g')
                cellDom.classList.add('green');
              else if (cell[1] == 'y')
                cellDom.classList.add('yellow');
              break;
          };
          rowDom.appendChild(cellDom);
        });
        board.appendChild(rowDom);
      });
    },
    async loadPlayers() {
      let reqData = {
        id: localStorage.getItem('player_id'),
        room: localStorage.getItem('room_id')
      };

      let res = await fetch('/game/getClients', {
        body: JSON.stringify(reqData),
        method: 'post'
      });

      if (res.ok) {
        let resData = await res.json();
        let playersDom = Array.from(document.getElementsByClassName('player'));
        resData.forEach((player, i) => {
          playersDom[i].innerText = decodeURIComponent(player.nick);
          playersDom[i].classList.add(player.color);
          playersDom[i].style.display = 'initial';
        });
        console.log(`${Utils.fullTime(new Date())} [SUCCESS] Loaded board and ${resData.length} players.`);
        return true;
      } else {
        console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to rejoin ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
        return false;
      };
    }
  },
  async action() { // uruchomiony szablon
    console.log(`${Utils.fullTime(new Date())} [WORKING] Loading board and players.`);
    this.data.loadBoard();
    await this.data.loadPlayers();
  },
  mount() { // montowanie i uruchamianie szablonu
    document.getElementById('root').innerHTML = this.template;
    this.action();
  },
  template: // szablon planszy
    `
    <nav class="info_bar">
      <div class="player_box">
        <p class="player"><i>player_name</i></p>
        <p class="player"><i>player_name</i></p>
        <p class="player"><i>player_name</i></p>
        <p class="player"><i>player_name</i></p>
      </div>
      <div class="clock_box">
        <p class="clock">Koniec tury: <span id="turn_clock">--:--</span></p>
        <p class="clock">Wygaśnięcie pokoju: <span id="room_clock">--:--</span></p>
      </div>
    </nav>

    <div class="center">
      <table class="board" id="board">
      </table>
    </div>

    <div id="movesBox">
    </div>
    `
}

export default lobby;