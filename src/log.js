import path from 'path';
import Moment from 'moment-timezone';
import winston from 'winston';
import 'winston-daily-rotate-file';

const consoleTransport = new winston.transports.Console({ colorize: true });

const fileTransport = new (winston.transports.DailyRotateFile)({
  filename: path.join(config.logDir, 'auth.%DATE%.log'),
  maxDays: 7,
});

const timezone = 'America/Edmonton';
const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
  const timestamp = new Moment().tz(timezone).format();
  const base = { timestamp };
  const json = Object.assign(base, logEntry);
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
};

const custom = {
  levels: {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    silent: 'white',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
  },
};

const options = {
  level: config.level,
  format: winston.format(jsonFormatter)(),
  levels: custom.levels,
  transports: [consoleTransport, fileTransport],
};

const logger = new winston.createLogger(options);
winston.addColors(custom);
module.exports = logger;
