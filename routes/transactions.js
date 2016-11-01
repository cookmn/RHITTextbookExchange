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
    mongoose.model('Transaction').find({}, function (err, transactions) {
      if (err) {
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(transactions); 
          }
        });
      }
    });
  })
  .post(function (req, res) {
    mongoose.model('Transaction').create({
        isBuy: req.body.isBuy,
        orderID: req.body.orderID,
        customerID: req.body.customerID,
        priceOfTransaction: req.body.priceOfTransaction
    }, function (err, transaction) {
      if (err) {
        res.send('problem adding transaction to the db');
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(transaction);
          }
        });
      }
    });
  });
    
// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Transaction').findById(id, function (err, transaction) {
        if (err || transaction === null) {
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
        mongoose.model('Transaction').findById(req.params.id, function (err, transaction) {    
            if (err) {
                res.status(404);
                err = new Error('Problem getting transaction');
                err.status = 404;
                res.format({
                    json: function() {
                        res.json({message: err.status + ' ' + err});
                    }
                });
            } else {            
                res.format({
                    json: function () {
                        res.json(transaction);
                    }
                });
            }
        })
    })
    .put(function(req, res) {
        mongoose.model('Transaction').findById(req.params.id, function (err, transaction) {
            transaction.isBuy = req.body.isBuy || transaction.isBuy;
            transaction.orderID = req.body.orderID || transaction.orderID;
            transaction.customerID = req.body.customerID || transaction.customerID;
            transaction.priceOfTransaction = req.body.priceOfTransaction || transaction.priceOfTransaction;

            transaction.save(function (err, trans) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating transaction');
                    err.status = 404;
                    res.format({
                        json: function() {
                            res.json({message: err.status + ' ' + err});
                        }
                    });
                } else {
                    res.format({
                        json: function() {
                            res.json(trans);
                        }
                    });
                }
            });
        });
    })
    .delete(function(req, res) {
        mongoose.model('Transaction').findByIdAndRemove(req.params.id)
            .exec(
                function (err, user) {
                    if (err) {
                        res.status(404);
                        err = new Error('Problem deleting transaction');
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