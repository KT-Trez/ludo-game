console.log('Loaded: Board.js');
import board from '../templates/board.js'
import pawnDom from '../templates/pawn.js'

import Utils from '../components/utils.js';

export default class Board {
  static nextLoad = null;
  static timers = {
    interval: null,
    move: null,
    room: null,
  };

  static clear(color) {
    let homeSquares = Array.from(document.getElementsByClassName('js-home'));
    let boardSquares = Array.from(document.getElementsByClassName('js-square'));
    let squares = homeSquares.concat(boardSquares);

    squares.forEach(square => {
      delete square.dataset.pawnId;
      delete square.dataset.pawnPlayer;
      square.innerHTML = '';
    });

    let movesBox = document.getElementById('js-moves');
    if (movesBox) Array.from(movesBox.children).forEach(child => child.id != 'js-moves__skip' ? child.remove() : null);

    Array.from(document.querySelectorAll(`[data-color]`)).forEach(player => player.classList.remove('js-active'));
    if (color) document.querySelector(`[data-color='${color}']`).classList.add('js-active');
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

      if (resData.skippable)
        document.getElementById('js-moves__skip').classList.remove('js-hide');
      else
        document.getElementById('js-moves__skip').classList.add('js-hide');

      Board.timers.room = resData.timers.room;
      Board.timers.move = resData.timers.move;

      Board.clear(resData.player);
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
        let movesBox = document.getElementById('js-moves');
        resData.avaliableMoves.forEach(move => {
          let pawn = document.querySelector(`[data-pawn-id='${move.pawn}'][data-pawn-player='${localStorage.getItem('player_color')}']`);
          let square = document.getElementById(move.square.new);

          let button = document.createElement('button');
          Object.assign(button, {
            classList: 'game__body__controls__moves__button',
            innerText: `Pionek: ${move.pawn} | ${move.square.old || 'Baza'} -> ${move.square.new}`,
            onclick: async () => {
              console.log(`${Utils.fullTime(new Date())} [WORKING] Trying to register move ${move.id}.`);
              square.classList.remove('js-preview');

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
              pawn.children[0].children[0].classList.add('js-preview');
              square.classList.add('js-preview');
            },
            onmouseout: () => {
              pawn.children[0].children[0].classList.remove('js-preview');
              square.classList.remove('js-preview');
            }
          });
          setTimeout(() => square.classList.remove('js-preview'), 5000);
          movesBox.append(button);
        });
      };

      if (resData.type == 'ended') {
        localStorage.clear();
        clearInterval(Board.timers.interval);
        console.log(`${Utils.fullTime(new Date())} [INFO] Game has ended!.`);

        Board.clear();
        document.querySelector(`[data-color='${resData.winner.color}']`).classList.add('js-win');

        let infoBox = document.getElementById('js-game-info');
        infoBox.classList.add('js-' + resData.winner.color, 'js-game-info--display-helper');
        infoBox.innerHTML = '<span style="font-size: 14px;">🎉</span> Wygrywa gracz: ' + decodeURIComponent(resData.winner.nick) + '! <span style="font-size: 14px;">🎉</span>';
        return true;
      };

      Board.nextLoad = setTimeout(Board.load, 5000);
      return true;
    } else {
      console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to get board update of ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
      setTimeout(Board.load, 5000);
      return false;
    };
  }

  static async start() {
    console.log(`${Utils.fullTime(new Date())} [INFO] Mounting board and loading pawns data.`);
    board.mount();
    await this.load();
    this.startClocks();
  }

  static startClocks() {
    this.timers.interval = setInterval(() => {
      if (this.timers.move - Date.now() > 0)
        document.getElementById('js-clocks__turn').innerText = Utils.timeMinutesSeconds(new Date(this.timers.move - Date.now()));
      else
        document.getElementById('js-clocks__turn').innerText = '00:00';

      if (this.timers.room - Date.now() > 0)
        document.getElementById('js-clocks__room').innerText = Utils.fullTime(new Date(this.timers.room - Date.now()));
      else
        document.getElementById('js-clocks__room').innerText = '00:00:00';
    }, 500);
  }

}