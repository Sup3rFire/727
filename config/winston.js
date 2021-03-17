const appRoot = require("app-root-path");
const winston = require("winston");

const humanReadable = winston.format.printf(({ level, message, timestamp }) => {
  return `${level} ${process.pid}: ${message}`;
});

const options = {
  fileJson: {
    level: "info",
    filename: `${appRoot}/logs/json.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
  },
  fileHumanReadable: {
    level: "info",
    filename: `${appRoot}/logs/human.log`,
    handleExceptions: true,
    format: winston.format.combine(humanReadable),
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(humanReadable),
    json: false,
    colorize: true,
  },
};

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.fileJson),
    new winston.transports.File(options.fileHumanReadable),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message);
  },
};

module.exports = logger;
