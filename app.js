var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var db = require('./model/db');

var routes = require('./routes/index');
var books = require('./routes/books');
var users = require('./routes/users');
var sellOrders = require('./routes/sellOrders');
var buyOrders = require('./routes/buyOrders');
var transactions = require('./routes/transactions');

var RosefireTokenVerifier = require('rosefire-node');

var app = express();
app.use(cors());

// view engine setup - currently not doing this
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));
var SECRET = "hwiN2rg1Eu8wX350a9y5";
var rosefire = new RosefireTokenVerifier(SECRET);

 app.use('/', routes);
 app.use('/books', books);
 app.use('/users', users);
 app.use('/transactions', transactions);
 app.use('/sellOrders', sellOrders);
 app.use('/buyOrders', buyOrders);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.post('/foobar', function (req, res) {
  var token = req.body.token;
  if (!token) {
    res.status(401).json({
      error: 'Not authorized!1' + req.body.token
    });
    return;
  }
  // token = token.split(' ')[1];
  rosefire.verify(token, function(err, authData) {
    if (err) {
      res.status(401).json({
        error: 'Not authorized!2'
      });
    } else {
      console.log(authData.username); // rockwotj
      console.log(authData.issued_at); // <Date Object of issued time> 
      console.log(authData.group); // STUDENT (Only there if options asked)
      console.log(authData.expires) // <Date Object> (Only there if options asked)
      res.json(authData);
      //res.send(authData);
    }
  });
});

module.exports = app;
