console.log('Loaded: Player.js');
import Utils from './Utils.js';

export default class Player { // klasa gracza; pozwala uzyskiwać połączenie do gry oraz informacje o graczu

  static async join(nick) { // funkcja pozwalająca dołączyć do pierwszego wolnego pokoju
    console.log(`${Utils.fullTime(new Date())} [WORKING] Joining first free lobby as ${nick}.`);
    let res = await fetch('/join/join?nick=' + nick);

    if (res.ok) {
      let resData = await res.json();
      localStorage.setItem('player_color', resData.color);
      localStorage.setItem('player_id', resData.id);
      localStorage.setItem('player_nick', nick);
      localStorage.setItem('room_id', resData.room);

      console.log(`${Utils.fullTime(new Date())} [SUCCESS] Joined first free lobby ${resData.room} as ${resData.id} (${nick}).`);
      return true;
    } else {
      console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to join first free lobby as ${nick}.`);
      return false;
    };
  }

  static async rejoin(nick) { // funkcja pozwalająca ponownie dołączyć do zapisanego pokoju
    console.log(`${Utils.fullTime(new Date())} [WORKING] Rejoining ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
    let reqData = {
      color: localStorage.getItem('player_color'),
      id: localStorage.getItem('player_id'),
      room: localStorage.getItem('room_id')
    };

    let res = await fetch('/join/rejoin', {
      body: JSON.stringify(reqData),
      method: 'post'
    });

    if (res.ok) {
      console.log(`${Utils.fullTime(new Date())} [SUCCESS] Rejoined ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
      return true;
    } else {
      console.log(`${Utils.fullTime(new Date())} [ERROR] Failed to rejoin ${localStorage.getItem('room_id')} as ${localStorage.getItem('player_id')}.`);
      await this.join(nick);
      return false;
    };
  }

  constructor() {
    this.color = localStorage.getItem('player_color');
    this.id = localStorage.getItem('player_id');
    this.room = localStorage.getItem('room_id');
  }

}