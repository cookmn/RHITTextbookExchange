var mongoose = require('mongoose');
var textbookSchema  = new mongoose.Schema({
    title: String,
    authors: String,
    ISBN: String,
    class: String,
    subject: String,
    imagePath: String
});

mongoose.model('Textbook', textbookSchema);