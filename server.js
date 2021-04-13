const express = require('express');
const path = require('path');
const events = require('./routes/events');
const game = require('./routes/game');
const utils = require('./src/utils');

const server = express();
const port = process.env.PORT || 3000;


server.use((req, res, next) => {
  console.log(`[${utils.Utils.fullTimeAndDate(new Date())}] Incoming connection. [${req.method}] [${req.headers.referer}] [${req.url}]`);
  next();
})

server.use(express.static(path.join(__dirname + '/static')));
server.use('/events', events.router);
server.use('/game', game.router);


server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});


server.listen(port, function() {
  console.log('-------------------------' + '\n' +
    'Server started' + '\n' +
    ' > port: ' + port + '\n' +
    '-------------------------');
});