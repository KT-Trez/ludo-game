const express = require('express');
const path = require('path');
const events = require('./routes/events');

const server = express();
const port = process.env.PORT || 3000;
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


// server.use(req => {
//   console.log(`${ccs.beautifyTime(new Date())} Incoming connection. [${req.method}] [${req.headers.referer}] [${req.url}]`);
// })

server.use(express.static(path.join(__dirname + '/static')));
server.use(path.join(__dirname + '/events'), events);


server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});


server.listen(port, function() {
  console.log('-------------------------' + '\n' +
    'Server started' + '\n' +
    ' > port: ' + port + '\n' +
    '-------------------------');
});

module.exports = {
  ccs
};