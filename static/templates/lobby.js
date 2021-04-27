console.log('Loaded template: lobby.js');
import Board from '../js/Board.js';
import Utils from '../js/Utils.js';

const lobby = { // eskportowany szablon lobby
  data: {
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

        for (let i = 0; i < resData.players.length; i++) { // odświeżanie użytkowników i stanu gotowości
          document.getElementById('player' + i).innerText = resData.players[i].nick; // ustawianie nicków graczy

          let checkbox = document.getElementById('player' + i + 'Switch'); // ustawianie stanu gotowości graczy
          checkbox.checked = resData.players[i].forceStart;

          if (resData.players[i].id == localStorage.getItem('player_id')) { // ustawianie sterowania własnym przyciskiem
            checkbox.removeAttribute('disabled');
            checkbox.onclick = () => {
              let reqData = {
                id: localStorage.getItem('player_id'),
                room: localStorage.getItem('room_id'),
                state: checkbox.checked
              };

              fetch('/join/lobbyStart', {
                body: JSON.stringify(reqData),
                method: 'post'
              });
            };
          } else { // wyłączanie sterowania cudzym przyciskiem
            checkbox.setAttribute('disabled', true);
            checkbox.onclick = null;
          };
        };

        if (resData.forceStart == resData.players.length && resData.forceStart > 1) { // uruchamianie gry, jeżeli lobby jest pełne
          console.log(`${Utils.fullTime(new Date())} [INFO] All ready, starting game.`);
          clearInterval(lobby.data.lobbyInterval);
          new Board().start();
        };

      } else { // wykonywanie akcji przy braku informacji o lobby
        console.log(`${Utils.fullTime(new Date())} [ERROR] Cannot find saved lobby or player.`);
        clearInterval(lobby.data.lobbyInterval);
      };
    },
    lobbyInterval: null
  },
  async action() { // uruchomiony szablon
    console.log(`${Utils.fullTime(new Date())} [INFO] Awaiting for lobby data and players.`);
    await this.data.getLobbyData();
    this.data.lobbyInterval = setInterval(this.data.getLobbyData, 5000);
  },
  mount() { // montowanie i uruchamianie szablonu
    document.getElementById('root').innerHTML = this.template;
    this.action();
  },
  template: // szablon lobby
    `
    <section>
      <p id="player0"></p>
      <input id="player0Switch" type="checkbox" disabled>
    </section>
    <section>
      <p id="player1"></p>
      <input id="player1Switch" type="checkbox" disabled>
    </section>
    <section>
      <p id="player2"></p>
      <input id="player2Switch" type="checkbox" disabled>
    </section>
    <section>
      <p id="player3"></p>
      <input id="player3Switch" type="checkbox" disabled>
    </section>
    `
}

export default lobby;