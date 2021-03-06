module.exports = async () => {
  const app = require("./app");
  const debug = require("debug")("express-test:server");
  const http = require("http");

  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  const server = http.createServer(app);

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  }

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }
  const Twitter = require("node-tweet-stream"),
    tw = new Twitter({
      consumer_key: process.env.CK,
      consumer_secret: process.env.CS,
      token: process.env.T,
      token_secret: process.env.TS,
    });

  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    const address = socket.request.connection.remoteAddress;
    console.log(
      `New Connection from ${
        socket.client.request.headers["cf-connecting-ip"] || address
      }`
    );
  });
  tw.track("727");
  tw.track("aireu");
  tw.track("WYSI");
  tw.on("tweet", (tweet) => {
    io.emit("tweet", tweet);
  });
};
