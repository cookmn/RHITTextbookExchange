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
    mongoose.model('User').find({}, function (err, users) {
      if (err) {
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(users); 
          }
        });
      }
    });
  })
  .post(function (req, res) {
    mongoose.model('User').create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        image: req.body.image,
        rating: req.body.rating,
        emailAddress: req.body.emailAddress,
        favoritedBuyOrders: req.body.favoritedBuyOrders,
        favoritedSellOrders: req.body.favoritedSellOrders,
        year: req.body.year,
        major: req.body.major,
        buyHistory: req.body.buyHistory,   //buy order ids
        sellHistory: req.body.sellHistory
    }, function (err, user) {
      if (err) {
        res.send('problem adding user to the db');
        console.log(err);
      } else {
        res.format({
          json: function () {
            res.json(user);
          }
        });
      }
    });
  });
    
// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('User').findById(id, function (err, user) {
        if (err || user === null) {
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
        mongoose.model('User').findById(req.params.id, function (err, user) {    
            if (err) {
                res.status(404);
                err = new Error('Problem getting user');
                err.status = 404;
                res.format({
                    json: function() {
                        res.json({message: err.status + ' ' + err});
                    }
                });
            } else {            
                res.format({
                    json: function () {
                        res.json(user);
                    }
                });
            }
        })
    })
    .put(function(req, res) {
        mongoose.model('User').findById(req.params.id, function (err, user) {

            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.image = req.body.image || user.image;
            user.rating = req.body.rating || user.rating;
            user.emailAddress = req.body.emailAddress || user.emailAddress;
            user.favoritedBuyOrders = req.body.favoritedBuyOrders || user.favoritedBuyOrders;
            user.favoritedSellOrders = req.body.favoritedSellOrders || user.favoritedSellOrders;
            user.year = req.body.year || user.year;
            user.major = req.body.major || user.major;
            user.buyHistory = req.body.buyHistory || user.buyHistory;
            user.sellHistory = req.body.sellHistory || user.sellHistory;

            user.save(function (err, person) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating user');
                    err.status = 404;
                    res.format({
                        json: function() {
                            res.json({message: err.status + ' ' + err});
                        }
                    });
                } else {
                    res.format({
                        json: function() {
                            res.json(person);
                        }
                    });
                }
            });
        });
    })
    .delete(function(req, res) {
        mongoose.model('User').findByIdAndRemove(req.params.id)
            .exec(
                function (err, user) {
                    if (err) {
                        res.status(404);
                        err = new Error('Problem deleting user');
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