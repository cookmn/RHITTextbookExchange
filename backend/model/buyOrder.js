var mongoose = require('mongoose');
var buyOrderSchema  = new mongoose.Schema({
    buyer: Number,
    textbook: Number,
    datePosted: Date,
    description: String,
    price: Number,
    condition: String,
    favoritedCount: Number
});

mongoose.model('buyOrder', buyOrderSchema);