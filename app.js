const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 引入环境变量
require("dotenv").config();

// 引入一个个路由模块
const danmakuRouter = require("./routes/danmaku");
const ipinfoRouter = require("./routes/ipinfo");
const airportsubRouter = require("./routes/airportsub");
const DEBUG = process.env.DEBUG==="true" || false;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("trust proxy", true);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", danmakuRouter);
app.use("/ipinfo", ipinfoRouter);
app.use("/sub", airportsubRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});
// 引入定时任务模块
const schedule = require("./schedule/schedule");
schedule(app);

if (!DEBUG) {
	console.log("PRODUCTION MODE!该模式下TG机器人正常运行");
	// 引入TG机器人
	require("./tgbot/bot");
} else
	console.log("DEBUG MODE!该模式下将关闭TG机器人");

module.exports = app;
