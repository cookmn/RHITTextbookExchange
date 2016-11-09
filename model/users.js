var mongoose = require('mongoose');
var userSchema  = new mongoose.Schema({
    firstName: String,
    lastName: String,
    image: String,
    rating: [Number],
    emailAddress: String,
    year: String,
    major: String,
    buyHistory: [Number],   //buy order ids
    sellHistory: [Number]
});

mongoose.model('User', userSchema);