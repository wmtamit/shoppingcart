require('dotenv').load()
const StripePubKey = process.env.STRIPE_PUBLIC_KEY
const  StripeSecretKey = process.env.STRIPE_SECRET_KEY
console.log(StripePubKey)
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressHbs = require("express-handlebars");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var MongoStore = require("connect-mongo")(session);
var app = express();

// const stripe=require("stripe")(keySecret);
// const pug=require('pug');
// const bodyParser = require('body-parser');
// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect("mongodb://127.0.0.1:27017/shopping", {
  useNewUrlParser: true
});

require("./config/passport");
// view engine setup
app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:60*60*1000}
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session=req.session;
  next();
});
app.use("/user", userRouter);
app.use("/", indexRouter);


app.use((req,res,next)=>{
  res.status(200).json({
    message:'Api working!'
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
