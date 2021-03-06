console.log('Loaded: Utils.js');

export default class Utils { // klasa pomocnicza

  static fullTime(time) { // funckja zwracająca czas w pełnym formacie
    function oneToDwoDigit(number) {
      if (number.toString().length == 1)
        return '0' + number;
      else
        return number.toString();
    };
    return oneToDwoDigit(time.getHours()) + ':' + oneToDwoDigit(time.getMinutes()) + ':' + oneToDwoDigit(time.getSeconds());
  }

  static fullTimeAndDate(time) { // funckja zwracająca czas i datę w pełnym formacie
    function oneToDwoDigit(number) {
      if (number.toString().length == 1)
        return '0' + number;
      else
        return number.toString();
    };
    return oneToDwoDigit(time.getHours()) + ':' + oneToDwoDigit(time.getMinutes()) + ':' + oneToDwoDigit(time.getSeconds()) + ' ' + oneToDwoDigit(time.getDate()) + '.' + oneToDwoDigit(time.getMonth()) + '.' + time.getFullYear();
  }

  static getRandomInt(min, max) { // funckja zwracająca liczbę z przedziału <min, max>
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static timeMinutesSeconds(time) { // funckja zwracająca czas w formacie mm:ss
    function oneToDwoDigit(number) {
      if (number.toString().length == 1)
        return '0' + number;
      else
        return number.toString();
    };
    return oneToDwoDigit(time.getMinutes()) + ':' + oneToDwoDigit(time.getSeconds());
  }

}