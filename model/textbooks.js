var mongoose = require('mongoose');
var textbookSchema  = new mongoose.Schema({
    title: String,
    authors: String,
    ISBN: String,
    course: String,
    imagePath: String,
    subject: String
});

mongoose.model('Textbook', textbookSchema);