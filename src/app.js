require('babel-register');

// load global config
config = require('config');

// setup global log
log = require('./log.js');

log.info('app starting');

const Server = require('./server');
const server = new Server(process.env.PORT || config.port);
server.start();
