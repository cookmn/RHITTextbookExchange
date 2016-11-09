var mongoose = require('mongoose');
var sellOrderSchema  = new mongoose.Schema({
    seller: String,
    textbook: String,
    datePosted: Date,
    description: String,
    price: Number,
    condition: String
});

mongoose.model('sellOrder', sellOrderSchema);