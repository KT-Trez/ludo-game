// import  Utils from './Utils.js';
import Player from './Player.js';

import lobby from '../templates/lobby.js'


window.addEventListener('DOMContentLoaded', () => {
  console.log('Loaded: app.js');

  document.getElementById('joinFree').onclick = async () => {
    if (!document.getElementById('nick').value) return;
    let nick = document.getElementById('nick').value;

    if (localStorage.getItem('player_color') && localStorage.getItem('player_id') && localStorage.getItem('room_id'))
      await Player.rejoin(nick);
    else
      await Player.join(nick);

    lobby.mount();
  };


});