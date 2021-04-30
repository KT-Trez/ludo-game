import Board from './classes/Board.js';
import Player from './classes/Player.js';

import lobby from './templates/lobby.js'


window.addEventListener('DOMContentLoaded', async () => {
  console.log('Loaded: app.js');

  if (localStorage.getItem('player_color') && localStorage.getItem('player_id') && localStorage.getItem('room_id')) {
    let hasRejoined = await Player.rejoin(nick);
    if (hasRejoined)
      document.getElementById('rejoin').onclick = () => Board.start();
    else
      document.getElementById('rejoin').setAttribute('disabled', true);
  } else
    document.getElementById('rejoin').setAttribute('disabled', true);

  document.getElementById('join').onclick = async () => {
    let nick = document.getElementById('nick').value;

    if (!nick) return;
    await Player.join(nick);
    lobby.mount();
  };
});