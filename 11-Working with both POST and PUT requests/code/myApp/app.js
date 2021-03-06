var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
/**
 * Connect DB:
 * Step 1:
 rm -rf /Users/hoangnd/tutorials/NodeJsTutorialES6/database
 mkdir  /Users/hoangnd/tutorials/NodeJsTutorialES6/database
 mongod --port 27017 --dbpath /Users/hoangnd/tutorials/NodeJsTutorialES6/database
 Step 2:
 Connect to DB, create database user:
 mongo --port 27017

 use tutorialMongoDB

 db.createUser({
   user: "hoangnd",
   pwd: "hoangnd",
   roles: [ "readWrite", "dbAdmin", "dbOwner" ]
 })

 Step 3:
 Re-start the MongoDB instance with access control.
 mongod --auth --port 27017 --dbpath /Users/hoangnd/tutorials/NodeJsTutorialES6/database

 Step 4:
 Connect mongdDB:
 mongo --port 27017 -u "hoangnd" -p "hoangnd" --authenticationDatabase "tutorialMongoDB"

 */
var mongoose = require('mongoose');
let options = {
  db: {native_parser: true},
  server: {poolSize: 5},
  user: 'hoangnd',
  pass: 'hoangnd'
};
// Use native Promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/tutorialMongoDB', options).then(
     () => {
      console.log("connect DB successfully");
    },
    err => {
      console.log('Connection failed. Error: ${err}');
    }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
