class Utils { // klasa pomocnicza
  static fullTimeAndDate(time) { // funckja zwracająca czas w pełnym formacie
    function oneToDwoDigit(number) {
      if (number.toString().length == 1)
        return '0' + number;
      else
        return number.toString();
    };
    return oneToDwoDigit(time.getHours()) + ':' + oneToDwoDigit(time.getMinutes()) + ':' + oneToDwoDigit(time.getSeconds()) + ' ' + oneToDwoDigit(time.getDate()) + '.' + oneToDwoDigit(time.getMonth()) + '.' + oneToDwoDigit(time.getFullYear());
  }
}

module.exports = {
  Utils
};