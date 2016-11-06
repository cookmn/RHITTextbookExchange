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
      subject: req.body.subject,
      imagePath: req.body.class
    }, function (err, book) {
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

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Textbook').findById(id, function (err, book) {
        if (err || book === null) {
            res.status(404);
            err = new Error('Not Found');
            err.status = 404;
            res.format({
                // html: function(){
                //     next(err);
                // },
                json: function () {
                    res.json({ message: err.status + ' ' + err });
                }
            });
        } else {
            // once validation is done, save new id in the req
            req.id = id;
            next();
        }
    });
});

// CHALLENGE:  Implement these API endpoints before next class
router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Textbook').findById(req.params.id, function (err, book) {    
            if (err) {
                res.status(404);
                err = new Error('Problem getting book');
                err.status = 404;
                res.format({
                    json: function() {
                        res.json({message: err.status + ' ' + err});
                    }
                });
            } else {            
                res.format({
                    json: function () {
                        res.json(book);
                    }
                });
            }
        })
    })
    .put(function(req, res) {
        mongoose.model('Textbook').findById(req.params.id, function (err, book) {
            book.title = req.body.title || book.title;
            book.subject = req.body.subject || book.subject;
            book.authors = req.body.authors || book.authors;
            book.ISBN = req.body.ISBN || book.ISBN;
            book.course = req.body.course || book.course;
            book.condition = req.body.condition || book.condition;
            book.imagePath = req.body.imagePath || book.imagePath;

            book.save(function (err, book) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating book');
                    err.status = 404;
                    res.format({
                        json: function() {
                            res.json({message: err.status + ' ' + err});
                        }
                    });
                } else {
                    res.format({
                        json: function() {
                            res.json(book);
                        }
                    });
                }
            });
        });
    })
    .delete(function(req, res) {
        mongoose.model('Textbook').findByIdAndRemove(req.params.id)
            .exec(
                function (err, book) {
                    if (err) {
                        res.status(404);
                        err = new Error('Problem deleting book');
                        err.status = 404;
                        res.format({
                            json: function() {
                                res.json({message: err.status + ' ' + err});
                            }
                        });
                    } else {
                        res.status(200);
                        res.format({
                            json: function() {
                                res.json(null);
                            }
                        });
                    }
                }
            );
    });


module.exports = router; 