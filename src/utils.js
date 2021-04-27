module.exports = class Utils { // klasa pomocnicza

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

  static logLevelBg(level) { // funckja wspomagająca logowanie informacji
    switch (level) {
      case 0: // [INFO]
        return '\u001b[36m';
      case 1: // [WORKING]
        return '\u001b[33m';
      case 2: // [SUCCESS]
        return '\u001b[32m';
      case 3: // [WARNING]
        return '\u001b[35m';
      case 4: // [ERROR]
        return '\u001b[31m';
      case 'end': // end of log
        return '\u001b[0m';
      default:
        return null;
    }
  }

  static logLevelFg(level) { // funckja wspomagająca logowanie informacji
    switch (level) {
      case 0: // [INFO]
        return '\u001b[46;1m';
      case 1: // [WORKING]
        return '\u001b[43;1m';
      case 2: // [SUCCESS]
        return '\u001b[42;1m';
      case 3: // [WARNING]
        return '\u001b[45;1m';
      case 4: // [ERROR]
        return '\u001b[41;1m';
      case 'end': // end of log
        return '\u001b[0m';
      default:
        return null;
    }
  }

}