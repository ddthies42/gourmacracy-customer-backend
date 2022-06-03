var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passwordReset = require("./routers/passwordReset");
const session = require('express-session');
const bodyParser = require('body-parser');

var indexRouter = require('./routers/index');
var userRouter = require('./routers/users');
var menuRouter = require('./routers/menuItems');

// redis
/*const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();*/
const router = express.Router();

var db = require('./db');

var app = express();

// view engine setup
//testing testing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, saveUninitialized: true, resave: true}))

// Replaces previous session
/*app.use(session({
  secret: 'keyboard cat',
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));*/

app.use(bodyParser.json());   

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//API
// To be able to use the API everywhere
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  //response.setHeader("Access-Control-Allow-Credentials", "true");
  response.header('Access-Control-Allow-Methods', 'GET,POST,PUT, PATCH, DELETE');
  //response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/menuItems', menuRouter);
app.use('/api/password-reset', passwordReset);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;