const appRoot = require("app-root-path"),
  autoprefixer = require("express-autoprefixer"),
  bodyParser = require("body-parser"),
  cloudflare = require("cloudflare-express"),
  compression = require("compression"),
  createError = require("http-errors"),
  express = require("express"),
  helmet = require("helmet"),
  minify = require("express-minify"),
  morgan = require("morgan"),
  path = require("path"),
  winston = require(`${appRoot}/config/winston`);

const indexRouter = require("./routes/index");

const app = express();

app.set("trust proxy", "loopback");
app.use(cloudflare.restore({ update_on_start: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(compression());
app.use(minify());
app.use(autoprefixer({ browsers: "last 2 versions", cascade: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  morgan(
    ':req[cf-connecting-ip] - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream: winston.stream }
  )
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use("/", indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.error = req.app.get("env") === "development" ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.cf_ip}`
  );

  res.status(err.status || 500);
  res.render("error", { title: `${err.status || 500}` });
});

module.exports = app;
