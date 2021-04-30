console.log('Loaded template: lobby.js');
import Board from '../classes/Board.js';

import Utils from '../components/utils.js';

const lobby = { // eskportowany szablon lobby
  data: {
    clearLobbyData() {
      for (let i = 0; i < 4; i++) {
        let nickBox = document.getElementById('js-player-' + i);
        nickBox.innerText = 'wolne miejsce';
        nickBox.classList.remove('js-me');
        nickBox.classList.add('js-free__player');

        let checkbox = document.getElementById('js-player-switch-' + i);
        checkbox.checked = false;
        checkbox.classList.remove('js-me');
        checkbox.classList.add('js-free__checkbox');

        let statusBox = document.getElementById('js-player-status-' + i);
        statusBox.innerText = 'brak';
        statusBox.classList.remove('js-me', 'js-status--ready', 'js-status--waiting');
        statusBox.classList.add('js-free__status');

        nickBox.parentElement.classList.remove('js-me-box');
      };
    },
    async getLobbyData() { // sprawdza informacje o lobby
      let reqData = { // dane żądania informacji
        id: localStorage.getItem('player_id'),
        room: localStorage.getItem('room_id')
      };

      let res = await fetch('/join/lobby', { // żądanie informacji o lobby
        body: JSON.stringify(reqData),
        method: 'post'
      });

      if (res.ok) { // wykonywanie akcji po otrzymaniu informacji o lobby
        let resData = await res.json();

        this.clearLobbyData();
        for (let i = 0; i < resData.players.length; i++) { // odświeżanie użytkowników i stanu gotowości
          let nickBox = document.getElementById('js-player-' + i);
          nickBox.innerText = decodeURIComponent(resData.players[i].nick);
          nickBox.classList.remove('js-free__player');
          if (resData.players[i].id == localStorage.getItem('player_id')) { // ustawianie sterowania własnym przyciskiem
            nickBox.classList.add('js-me');
            nickBox.innerText = '▷' + nickBox.innerText;
            nickBox.parentElement.classList.add('js-me-box');
          };

          let checkbox = document.getElementById('js-player-switch-' + i);
          checkbox.checked = resData.players[i].forceStart;
          checkbox.classList.remove('js-free__checkbox');
          if (resData.players[i].id == localStorage.getItem('player_id')) { // ustawianie sterowania własnym przyciskiem
            checkbox.removeAttribute('disabled');
            nickBox.classList.add('js-me');
            checkbox.onclick = () => this.startLobby(checkbox.checked);
          };

          let statusBox = document.getElementById('js-player-status-' + i);
          statusBox.innerText = resData.players[i].forceStart ? 'gotowy' : 'oczekuje';
          statusBox.classList.remove('js-free__status');
          resData.players[i].forceStart ? statusBox.classList.add('js-status--ready') : statusBox.classList.add('js-status--waiting');
        };
        document.getElementById('js-lobby-info').innerText = 'Oczekiwanie na graczy';

        if (resData.forceStart == resData.players.length && resData.forceStart > 1) { // uruchamianie gry, jeżeli lobby jest pełne
          console.log(`${Utils.fullTime(new Date())} [INFO] All ready, starting game.`);
          clearInterval(lobby.data.lobbyInterval);
          this.isStarting = true;
          document.getElementById('js-lobby-info').innerText = 'Wczytywanie gry ...';
          setTimeout(() => Board.start(), 3000);
        };
      } else { // wykonywanie akcji przy braku informacji o lobby
        document.getElementById('js-lobby-info').innerText = 'Błąd podczas odświeżania poczekalni, oczekiwanie ...';
        console.log(`${Utils.fullTime(new Date())} [ERROR] Cannot find saved lobby or player.`);
        clearInterval(lobby.data.lobbyInterval);
      };
    },
    async startLobby(checked) {
      if (this.isStarting) return;
      let reqData = {
        id: localStorage.getItem('player_id'),
        room: localStorage.getItem('room_id'),
        state: checked
      };

      let res = await fetch('/join/lobbyStart', {
        body: JSON.stringify(reqData),
        method: 'post'
      });

      if (!res.ok)
        document.getElementById('js-lobby-info').innerText = 'Błąd podczas próby wcześniejszego startu, oczekiwanie ...';
      else
        document.getElementById('js-lobby-info').innerText = 'Oczekiwanie na graczy';
    },
    isStarting: false,
    lobbyInterval: null
  },
  async action() { // uruchomiony szablon
    console.log(`${Utils.fullTime(new Date())} [INFO] Awaiting for lobby data and players.`);
    await this.data.getLobbyData();
    this.data.lobbyInterval = setInterval(() => this.data.getLobbyData(), 5000);
  },
  mount() { // montowanie i uruchamianie szablonu
    document.getElementById('root').innerHTML = this.template;
    this.action();
  },
  template: // szablon lobby
    `
    <div class="lobby">
      <span class="lobby__info" id="js-lobby-info">Oczekiwanie na graczy</span>
      <div class="lobby__players-box">
        <div class="lobby__players-box__player-box js-red">
          <p class="lobby__players-box__player-box__nick js-free__player" id="js-player-0">wolne miejsce</p>
          <input class="lobby__players-box__player-box__checkbox js-free__checkbox" id="js-player-switch-0" type="checkbox" disabled>
          <span class="lobby__players-box__player-box__status js-free__status" id="js-player-status-0">brak</span>
        </div>
        <div class="lobby__players-box__player-box js-blue">
          <p class="lobby__players-box__player-box__nick js-free__player" id="js-player-1">wolne miejsce</p>
          <input class="lobby__players-box__player-box__checkbox js-free__checkbox" id="js-player-switch-1" type="checkbox" disabled>
          <span class="lobby__players-box__player-box__status js-free__status" id="js-player-status-1">brak</span>
        </div>
        <div class="lobby__players-box__player-box js-green">
          <p class="lobby__players-box__player-box__nick js-free__player" id="js-player-2">wolne miejsce</p>
          <input class="lobby__players-box__player-box__checkbox js-free__checkbox" id="js-player-switch-2" type="checkbox" disabled>
          <span class="lobby__players-box__player-box__status js-free__status" id="js-player-status-2">brak</span>
        </div>
        <div class="lobby__players-box__player-box js-yellow">
          <p class="lobby__players-box__player-box__nick js-free__player" id="js-player-3">wolne miejsce</p>
          <input class="lobby__players-box__player-box__checkbox js-free__checkbox" id="js-player-switch-3" type="checkbox" disabled>
          <span class="lobby__players-box__player-box__status js-free__status" id="js-player-status-3">brak</span>
        </div>
      </div>
    </div>
    `
}

export default lobby;