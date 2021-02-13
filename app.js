var createError = require('http-errors');
var express = require('express');
const mongodb = require('mongodb');
const path = require('path');
let MongoClient = mongodb.MongoClient;
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
let contactRouter = require('./routes/contacts');

var app = express();

// Mongo
MongoClient.connect("mongodb+srv://jon:jonjon@cluster0.z5bzl.mongodb.net/<dbname>?retryWrites=true&w=majority", function (err, client) { // Local
  // MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
  if (err !== null) {
    console.log(err);
  } else {
    app.locals.db = client.db("stiki");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Bootstrap
app.use('/bootstrap-js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/bootstrap-css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use('/', indexRouter);
app.use('/contacts', contactRouter);

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
