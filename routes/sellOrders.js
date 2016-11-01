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
    mongoose.model('sellOrder').find({}, function (err, sellOrders) {
      if (err) {
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(sellOrders); 
          }
        });
      }
    });
  })
  .post(function (req, res) {
    mongoose.model('sellOrder').create({
        seller: req.body.seller,
        textbook: req.body.textbook,
        datePosted: req.body.datePosted,
        description: req.body.description,
        price: req.body.price,
        condition: req.body.condition,
        favoritedCount: req.body.favoritedCount
    }, function (err, sellOrder) {
      if (err) {
        res.send('problem adding sell order to the db');
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(sellOrder);
          }
        });
      }
    });
  });
    
// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('sellOrder').findById(id, function (err, sellOrder) {
        if (err || sellOrder === null) {
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
        mongoose.model('sellOrder').findById(req.params.id, function (err, sellOrder) {    
            if (err) {
                res.status(404);
                err = new Error('Problem getting sell order');
                err.status = 404;
                res.format({
                    json: function() {
                        res.json({message: err.status + ' ' + err});
                    }
                });
            } else {            
                res.format({
                    json: function () {
                        res.json(sellOrder);
                    }
                });
            }
        })
    })
    .put(function(req, res) {
        mongoose.model('sellOrder').findById(req.params.id, function (err, sellOrder) {
            sellOrder.seller = req.body.seller || sellOrder.seller;
            sellOrder.textbook = req.body.textbook || sellOrder.textbook;
            sellOrder.datePosted = req.body.datePosted || sellOrder.datePosted;
            sellOrder.description = req.body.description || sellOrder.description;
            sellOrder.price = req.body.price || sellOrder.price;
            sellOrder.condition = req.body.condition || sellOrder.condition;
            sellOrder.favoritedCount = req.body.favoritedCount || sellOrder.favoritedCount;

            sellOrder.save(function (err, order) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating sell order');
                    err.status = 404;
                    res.format({
                        json: function() {
                            res.json({message: err.status + ' ' + err});
                        }
                    });
                } else {
                    res.format({
                        json: function() {
                            res.json(order);
                        }
                    });
                }
            });
        });
    })
    .delete(function(req, res) {
        mongoose.model('sellOrder').findByIdAndRemove(req.params.id)
            .exec(
                function (err, user) {
                    if (err) {
                        res.status(404);
                        err = new Error('Problem deleting sell order');
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