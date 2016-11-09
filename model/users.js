var mongoose = require('mongoose');
var userSchema  = new mongoose.Schema({
    firstName: String,
    lastName: String,
    image: String,
    rating: [Number],
    emailAddress: String,
    year: String,
    major: String,
    buyHistory: [String],   //buy order ids
    sellHistory: [String]
});

mongoose.model('User', userSchema);