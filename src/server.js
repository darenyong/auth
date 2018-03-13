import express from 'express';
import cookieParser from 'cookie-parser';
import _ from 'lodash';
import routes from './routes';

const notFound = function (req, res, next) {
  const url = decodeURI(req.url);
  const query = JSON.stringify(req.query);
  const { method } = req;
  log.warn('404 Not found', { method, url, query });

  const err = new Error('Not Found');
  err.title = 'Not Found';
  err.status = 404;
  next(err);
};

const errorHandler = function (err, req, res, next) {
  const code = err.status || 500;
  const title = err.title || 'Error';
  const message = err.message || 'Error';
  const resObj = req.app.get('env') === 'development' ? err
    : JSON.stringify({ code: code, title: title, message: message });
  res.status(code);
  next(resObj);
};

module.exports = class Server {
  constructor(listenPort) {
    this.listenPort = listenPort;
    this.app = express();
    this.app.use(cookieParser());

    // setup routes
    this.app.use('/', routes);

    // catch 404 and forward to error handler
    this.app.use(notFound);

    // error handler
    this.app.use(errorHandler);

    // bind methods
    _.bindAll(this, 'start', 'stop', 'gracefulShutdown');
  }

  start() {
    if (this.server) return; // server already started
    log.info('server listening', { port: this.listenPort });
    this.server = this.app.listen(this.listenPort);

    // hook process signals for graceful express shutdown
    this.sigint = _.partial(this.gracefulShutdown, 'SIGINT');
    this.sigterm = _.partial(this.gracefulShutdown, 'SIGTERM');
    process.on('SIGINT', this.sigint);
    process.on('SIGTERM', this.sigterm);
  }

  stop() {
    const { server } = this;
    if (!server) return; // server not started
    log.info('stopping server');

    // unhook
    process.removeListener('SIGINT', this.sigint);
    process.removeListener('SIGTERM', this.sigterm);

    server.close(() => {
      this.server = null;
      log.info('server stopped');
    });
  }

  gracefulShutdown(signal) {
    log.warn('graceful shutdown initiated', { signal });
    this.server.close(() => {
      this.server = null;
      log.warn('express stopped gracefully, exiting process now', { signal });
      process.exit();
    });
  }
};