console.log('Loaded template: board.js');
import Board from '../classes/Board.js';

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

      let board = document.getElementById('js-board');
      boardMemory.forEach(row => {
        let rowDom = document.createElement('tr');
        row.forEach(cell => {
          let cellDom = document.createElement('td');
          switch (typeof(cell)) {
            case 'number':
              cellDom.classList.add('js-square');
              cellDom.setAttribute('id', cell);
              break;
            case 'string':
              if (cell[0] == 'f')
                cellDom.setAttribute('id', cell);
              else
                cellDom.classList.add(cell, 'js-home');

              if (cell[1] == 'r')
                cellDom.classList.add('js-red');
              else if (cell[1] == 'b')
                cellDom.classList.add('js-blue');
              else if (cell[1] == 'g')
                cellDom.classList.add('js-green');
              else if (cell[1] == 'y')
                cellDom.classList.add('js-yellow');
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
        let playersDom = Array.from(document.getElementsByClassName('game__info-bar__players__player'));
        resData.forEach((player, i) => {
          playersDom[i].classList.add('js-' + player.color);
          playersDom[i].classList.remove('js-hide');
          playersDom[i].dataset.color = player.color;
          playersDom[i].innerText = decodeURIComponent(player.nick);

          if (player.color == localStorage.getItem('player_color'))
            playersDom[i].classList.add('js-info-bar__me');
        });
        console.log(`${Utils.fullTime(new Date())} [SUCCESS] Loaded board and ${resData.length} players.`);
        return true;
      } else {
        console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to rejoin ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
        return false;
      };
    },
    registerSkip() {
      document.getElementById('js-moves__skip').onclick = async () => {
        console.log(`${Utils.fullTime(new Date())} [WORKING] Trying to register skip.`);
        let res = await fetch('/game/registerSkip', {
          method: 'post',
          body: JSON.stringify({
            id: localStorage.getItem('player_id'),
            room: localStorage.getItem('room_id')
          })
        });

        if (res.ok) {
          clearTimeout(Board.nextLoad);
          document.getElementById('js-moves__skip').classList.add('js-hide');
          document.getElementById('js-roll__dice').src = '../../gfx/dice-0.svg';
          Board.load();
          console.log(`${Utils.fullTime(new Date())} [SUCCESS] Registered skip.`);
        } else
          console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to register skip.`);
      };
    }
  },
  async action() { // uruchomiony szablon
    console.log(`${Utils.fullTime(new Date())} [WORKING] Loading board and players.`);
    this.data.loadBoard();
    this.data.registerSkip();
    await this.data.loadPlayers();
  },
  mount() { // montowanie i uruchamianie szablonu
    document.getElementById('root').innerHTML = this.template;
    this.action();
  },
  template: // szablon planszy
    `
    <div class="game">
      <div class="game__info-bar">
        <div class="game__info-bar__players" id="js-players">
          <p class="game__info-bar__players__player js-hide">player_name</p>
          <p class="game__info-bar__players__player js-hide">player_name</p>
          <p class="game__info-bar__players__player js-hide">player_name</p>
          <p class="game__info-bar__players__player js-hide">player_name</p>
        </div>
        <div class="game__info-bar__clocks">
          <p class="game__info-bar__clocks__clock">Koniec tury: <span id="js-clocks__turn">--:--</span></p>
          <p class="game__info-bar__clocks__clock">Wygaśnięcie pokoju: <span id="js-clocks__room">--:--:--</span></p>
        </div>
      </div>
      <span class="game__info" id="js-game-info">Gra uruchomiona</span>
      <div class="game__body">
        <div class="game__body__controls">
          <div class="game__body__controls__roll">
            <button class="game__body__controls__roll__button" id="js-roll__mute">♫</button>
            <button class="game__body__controls__roll__button" id="js-roll__roll" disabled>Rzuć kostką</button>
            <img id="js-roll__dice" alt="dice" src="../../gfx/dice-0.svg">
          </div>
          <div class="game__body__controls__moves" id="js-moves">
            <button class="game__body__controls__moves__button js-hide" id="js-moves__skip">Pomiń turę</button>
          </div>
        </div>
        <div class="game__body__board-outer-box">
          <div class="game__body__board-outer-box__board-inner-box">
            <table id="js-board"></table>
          </div>
        </div>
      </div>
    </div>
    `
}

export default lobby;