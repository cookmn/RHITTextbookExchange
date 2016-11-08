var mongoose = require('mongoose');
var transactionSchema  = new mongoose.Schema({
    isBuy: Boolean,
    orderID: String,
    customerID: String,
    priceOfTransaction: Number
});

mongoose.model('Transaction', transactionSchema);