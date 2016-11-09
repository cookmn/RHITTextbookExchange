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
    mongoose.model('buyOrder').find({}, function (err, buyOrders) {
      if (err) {
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(buyOrders); 
          }
        });
      }
    });
  })
  .post(function (req, res) {
    mongoose.model('buyOrder').create({
        buyer: req.body.buyer,
        textbook: req.body.textbook,
        datePosted: req.body.datePosted,
        description: req.body.description,
        price: req.body.price,
        condition: req.body.condition
    }, function (err, buyOrder) {
      if (err) {
        res.send('problem adding sell order to the db');
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(buyOrder);
          }
        });
      }
    });
  });
    
// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('buyOrder').findById(id, function (err, buyOrder) {
        if (err || buyOrder === null) {
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
        mongoose.model('buyOrder').findById(req.params.id, function (err, buyOrder) {    
            if (err) {
                res.status(404);
                err = new Error('Problem getting buy order');
                err.status = 404;
                res.format({
                    json: function() {
                        res.json({message: err.status + ' ' + err});
                    }
                });
            } else {            
                res.format({
                    json: function () {
                        res.json(buyOrder);
                    }
                });
            }
        })
    })
    .put(function(req, res) {
        mongoose.model('buyOrder').findById(req.params.id, function (err, buyOrder) {
            buyOrder.buyer = req.body.seller || buyOrder.buyer;
            buyOrder.textbook = req.body.textbook || buyOrder.textbook;
            buyOrder.datePosted = req.body.datePosted || buyOrder.datePosted;
            buyOrder.description = req.body.description || buyOrder.description;
            buyOrder.price = req.body.price || buyOrder.price;
            buyOrder.condition = req.body.condition || buyOrder.condition;

            buyOrder.save(function (err, order) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating buy order');
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
        mongoose.model('buyOrder').findByIdAndRemove(req.params.id)
            .exec(
                function (err, user) {
                    if (err) {
                        res.status(404);
                        err = new Error('Problem deleting buy order');
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