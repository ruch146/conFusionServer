var createError = require('http-errors');
var express = require('express');



var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport=require('passport');
var authenticate=require('./authenticate');
var config=require('./config');



//for connection with the databse
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');

//for schema of dishes
const Dishes = require('./models/dishes');

//url for connection with mongodb server
const url = config.mongoUrl;
//connection using mongoose
const connect = mongoose.connect(url);

//establish connection
connect.then((db) => {
  console.log("Connected correctlt to server");
}, (err) => { console.log(err) })


var app = express();


// Secure traffic only
//redirecting http to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//secret key as parameter to encrypt info and sign the cookie which is sent from server to client
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());


//user can access these without authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload',uploadRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
