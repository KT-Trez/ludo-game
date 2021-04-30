console.log('Loaded: Board.js');
import board from '../templates/board.js'
import pawnDom from '../templates/pawn.js'

import Utils from '../components/utils.js';

export default class Board {
  static nextLoad = null;

  static clear() {
    let homeSquares = Array.from(document.getElementsByClassName('home'));
    let boardSquares = Array.from(document.getElementsByClassName('square'));
    let squares = homeSquares.concat(boardSquares);

    squares.forEach(square => {
      delete square.dataset.pawnId;
      delete square.dataset.pawnPlayer;
      square.innerHTML = '';
    });

    let movesBox = document.getElementById('movesBox');
    if (movesBox) Array.from(movesBox.children).forEach(child => child.remove());
  }

  static async load() {
    let reqData = {
      id: localStorage.getItem('player_id'),
      room: localStorage.getItem('room_id')
    };

    let res = await fetch('/game/boardUpdate', {
      body: JSON.stringify(reqData),
      method: 'post'
    });

    if (res.ok) {
      let resData = await res.json();

      Board.clear();
      resData.pawns.forEach(pawn => {
        if (pawn.state == 'home') {
          let homeSquares = document.getElementsByClassName('h' + pawn.player[0]);
          for (let i = 0; i < homeSquares.length; i++)
            if (!homeSquares[i].innerHTML) {
              homeSquares[i].innerHTML = pawnDom.mount(pawn);

              homeSquares[i].dataset.pawnId = pawn.id;
              homeSquares[i].dataset.pawnPlayer = pawn.player;
              break;
            };
        } else if (pawn.state == 'board') {

          let boardSquare = document.getElementById(pawn.square);
          boardSquare.innerHTML = pawnDom.mount(pawn);

          boardSquare.dataset.pawnId = pawn.id;
          boardSquare.dataset.pawnPlayer = pawn.player;
        } else {
          let finishSquare = document.getElementById(pawn.square);
          finishSquare.innerHTML = pawnDom.mount(pawn);
        };
      });

      if (resData.type == 'read_write') {
        let movesBox = document.getElementById('movesBox');
        resData.avaliableMoves.forEach(move => {
          let pawn = document.querySelector(`[data-pawn-id='${move.pawn}'][data-pawn-player='${localStorage.getItem('player_color')}']`);
          let square = document.getElementById(move.square.new);

          let button = document.createElement('button');
          Object.assign(button, {
            innerText: `Pionek: ${move.pawn} | ${move.square.old || 'Baza'} -> ${move.square.new}`,
            onclick: async () => {
              console.log(`${Utils.fullTime(new Date())} [WORKING] Trying to register move ${move.id}.`);
              square.classList.remove('prieview');

              let res = await fetch('/game/registerMove', {
                method: 'post',
                body: JSON.stringify({
                  id: localStorage.getItem('player_id'),
                  moveId: move.id,
                  room: localStorage.getItem('room_id')
                })
              });

              if (res.ok) {
                clearTimeout(Board.nextLoad);
                Board.load();
                console.log(`${Utils.fullTime(new Date())} [SUCCESS] Registered move ${move.id}.`);
              } else
                console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to register move ${move.id}.`);
            },
            onmouseover: () => {
              pawn.children[0].children[0].style.backgroundColor = 'white';
              square.classList.add('prieview');
            },
            onmouseout: () => {
              pawn.children[0].children[0].style.backgroundColor = 'black';
              square.classList.remove('prieview');
            }
          });
          setTimeout(() => square.classList.remove('prieview'), 5000);
          movesBox.append(button);
        });
      };

      Board.nextLoad = setTimeout(Board.load, 5000);
      return true;
    } else {
      console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to get board update of ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
      setTimeout(Board.load, 5000);
      return false;
    };
  }

  static start() {
    console.log(`${Utils.fullTime(new Date())} [INFO] Mounting board and loading pawns data.`);
    board.mount();
    this.load();
  }

}