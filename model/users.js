var mongoose = require('mongoose');
var userSchema  = new mongoose.Schema({
    firstName: String,
    lastName: String,
    profilePicture: String,
    rating: Number,
    emailAddress: String,
    favoritedBuyOrders: [Number],
    favoritedSellOrders: [Number],
    year: Number,
    major: String,
    buyHistory: [Number],   //buy order ids
    sellHistory: [Number]
});

mongoose.model('User', userSchema);