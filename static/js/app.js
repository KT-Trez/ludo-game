import Board from './classes/Board.js';
import Player from './classes/Player.js';

import lobby from './templates/lobby.js'


window.addEventListener('DOMContentLoaded', async () => {
  console.log('Loaded: app.js');

  if (localStorage.getItem('player_color') && localStorage.getItem('player_id') && localStorage.getItem('room_id')) {
    let hasRejoined = await Player.rejoin(nick);
    if (hasRejoined)
      document.getElementById('rejoin').onclick = async () => {
        let reqData = {
          id: localStorage.getItem('player_id'),
          room: localStorage.getItem('room_id')
        };

        let res = await fetch('/join/lobby', {
          body: JSON.stringify(reqData),
          method: 'post'
        });

        if (res.ok) {
          let resData = await res.json();
          if (resData.forceStart == resData.players.length && resData.forceStart > 1)
            Board.start();
          else
            lobby.mount();
        } else
          Board.start();
      };
    else {
      localStorage.clear();
      document.getElementById('rejoin').setAttribute('disabled', true);
    };
  } else
    document.getElementById('rejoin').setAttribute('disabled', true);

  document.getElementById('join').onclick = async () => {
    let nick = document.getElementById('nick');
    if (!nick.value) {
      nick.classList.add('js-join__elements-box__input--placeholder');
      return setTimeout(() => nick.classList.remove('js-join__elements-box__input--placeholder'), 3000);
    };

    await Player.join(nick.value);
    lobby.mount();
  };
});