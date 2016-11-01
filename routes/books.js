var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // parse info from POST
var methodOverride = require('method-override'); // used to manipulate Post data

// adding some middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {     // in case we're working with an older browser
    if (req.body && typeof req.body == "object" && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

router.route('/')
  .get(function (req, res, next) {
    mongoose.model('Textbook').find({}, function (err, books) {
      if (err) {
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(books); 
          }
        });
      }
    });
  })
  .post(function (req, res) {
    mongoose.model('Textbook').create({
      title: req.body.title,
      authors: req.body.authors,
      ISBN: req.body.ISBN,
      class: req.body.class,
      imagePath: req.body.class
    }, function (err, contact) {
      if (err) {
        res.send('problem adding book to the db');
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(book);
          }
        });
      }
    });
  });

module.exports = router; 