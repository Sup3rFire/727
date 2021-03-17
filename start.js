const cluster = require("cluster"),
  winston = require(`./config/winston`);

if (cluster.isMaster) {
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    winston.info(`Worker ${worker.process.pid} is online`);
  });
  cluster.on("exit", function (worker, code, signal) {
    winston.error(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    winston.info("Starting a new worker");
    cluster.fork();
    worker.on("message", function (message) {
      winston.info(message);
    });
  });
} else {
  require("dotenv").config();

  require("./server")();
  process.on("message", function (message) {
    if (message.type === "shutdown") {
      process.exit(0);
    }
  });
}
