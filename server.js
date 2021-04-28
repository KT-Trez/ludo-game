const express = require('express');
const path = require('path');

const dev = require('./src/routes/dev');
const game = require('./src/routes/game');
const join = require('./src/routes/join');

const Utils = require('./src/components/utils');

const server = express();
const port = process.env.PORT || 3000;


server.use((req, res, next) => {
  console.log(`${Utils.fullTimeAndDate(new Date())} [INFO] Incoming connection. | ${req.method} ${req.headers.referer} ${req.url}`);
  next();
})

server.use(express.static(path.join(__dirname + '/static')));
server.use(express.static(path.join(__dirname + '/static/js/classes')));
server.use(express.static(path.join(__dirname + '/static/js/components')));
server.use(express.static(path.join(__dirname + '/static/js/templates')));
server.use('/dev', dev.router);
server.use('/join', join.router);
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