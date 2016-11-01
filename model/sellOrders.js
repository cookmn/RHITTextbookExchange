var mongoose = require('mongoose');
var sellOrderSchema  = new mongoose.Schema({
    seller: Number,
    textbook: Number,
    datePosted: Date,
    description: String,
    price: Number,
    condition: String,
    favoritedCount: Number
});

mongoose.model('sellOrder', sellOrderSchema);