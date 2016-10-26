var mongoose = require('mongoose');
var transactionSchema  = new mongoose.Schema({
    isBuy: Boolean,
    orderID: Number,
    customerID: Number,
    priceOfTransaction: Number
});

mongoose.model('Transaction', transactionSchema);