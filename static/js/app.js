const ccs = {
  beautifyTime(time) {
    function twoDigit(digit) {
      if (digit.toString().length == 1)
        return '0' + digit;
      else
        return digit.toString();
    };
    return twoDigit(time.getHours()) + ':' + twoDigit(time.getMinutes()) + ':' + twoDigit(time.getSeconds());
  }
};

class Board { // klasa opisująca planszę
  static data = {
    eventSrc: null
  }

  static loadPlayer() { // dołącza gracza do nowej sesji lub wznawia starą
    const joinFreeButton = document.getElementById('joinFree');
    joinFreeButton.onclick = async () => {
      console.log(`${ccs.beautifyTime(new Date())} [INFO] Wybrano dołącznie do wolnego pokoju.`);

      let session = localStorage.getItem('room_id');
      if (session) {
        let sessionExists = await Player.checkSessionRejoinable();
        if (!sessionExists) {
          Player.joinNewSession();
        } else {
          Player.rejoinSession();
        }
      } else {
        Player.joinNewSession();
      };
    };
  }

  constructor() {

  }

}

class Player { // klasa opisująca gracza
  // constructor Player
  color; // String
  id; // String
  number; // Number
  pawns; // Object<Pawn>

  static joinNewSession() { // dołącza do pierwszej wolnej sesji
    console.log(`${ccs.beautifyTime(new Date())} [INFO] Uzyskiwanie nowej sesji.`);
    Board.data.eventSrc = new EventSource('/events/connection');
    Board.data.eventSrc.onmessage = event => {
      const resData = JSON.parse(event.data);
      localStorage.setItem('room_id', resData.data.room.id);
      localStorage.setItem('player_id', resData.data.client.id);

      console.log(`${ccs.beautifyTime(new Date())} [INFO] Uzyskano nową sesję ${resData.data.room.id} jako ${resData.data.client.id}.`);
    }
  }

  static rejoinSession() { // dołącza ponownie do zapisanej sesji
    const room = localStorage.getItem('room_id');
    const client = localStorage.getItem('player_id');
    console.log(`${ccs.beautifyTime(new Date())} [INFO] Ponowne dołączanie do sesji ${room} jako ${client}.`);

    Board.data.eventSrc = new EventSource('/events/connection?' + `room=${room}&client=${client}`);
    Board.data.eventSrc.onmessage = event => {
      const resData = JSON.parse(event.data);
      if (resData.type == 'rejoin' && resData.data.status)
        console.log(`${ccs.beautifyTime(new Date())} [INFO] Połączono ponownie z ${room} jako ${client}.`);
      else {
        Board.data.eventSrc.close();
        console.log(`${ccs.beautifyTime(new Date())} [WARNING] Nie udało się połączyć ponownie z ${room} jako ${client}`);
      };
      Board.data.eventSrc.onmessage = null;
    }
  }

  static async checkSessionRejoinable() { // sprawdza czy dane z klienta zgadzają się z danymi z serwera
    console.log(`${ccs.beautifyTime(new Date())} [INFO] Sprawdzanie czy sesja z localStorage istnieje na serwerze.`);
    let res = await fetch('/events/checkSession', {
      method: 'post',
      body: JSON.stringify({
        roomId: localStorage.getItem('room_id'),
        clientId: localStorage.getItem('player_id')
      })
    })
    // .catch(err => console.log(err));
    if (res.status == 200) {
      console.log(`${ccs.beautifyTime(new Date())} [INFO] Sesja z localStorage istnieje na serwerze.`);
      return true;
    } else {
      console.log(`${ccs.beautifyTime(new Date())} [INFO] Brak sesji z localStorage na serwerze.`);
      return false;
    }
  }

  constructor() {
    this.color = color;
    this.id = id;
    this.number = number;
    this.pawns = {
      pawn0: 'h',
      pawn1: 'h',
      pawn2: 'h',
      pawn3: 'h'
    };
  }
}

// await fetch('/events/join')
//   .then(res => res.json())
//   .then(resData => {
//     console.log(resData);
//   })
//   .catch(err => console.log(err))


// if (!!window.EventSource) {
//   var source = new EventSource('/countdown')
//
//   source.addEventListener('message', function(e) {
//     document.getElementById('data').innerHTML = e.data
//   }, false)
//
//   source.addEventListener('open', function(e) {
//     document.getElementById('state').innerHTML = "Connected"
//   }, false)
//
//   source.addEventListener('error', function(e) {
//     const id_state = document.getElementById('state')
//     if (e.eventPhase == EventSource.CLOSED)
//       source.close()
//     if (e.target.readyState == EventSource.CLOSED) {
//       id_state.innerHTML = "Disconnected"
//     }
//     else if (e.target.readyState == EventSource.CONNECTING) {
//       id_state.innerHTML = "Connecting..."
//     }
//   }, false)
// } else {
//   console.log("Your browser doesn't support SSE")
// }


window.addEventListener('DOMContentLoaded', () => {
  console.log('Loaded: app.js');

  Board.loadPlayer();
});