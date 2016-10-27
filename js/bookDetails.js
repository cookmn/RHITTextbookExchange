function setup() {
    console.log("setting up");

    var bookDiv = document.getElementById("book-info");
    var sellerDiv = document.getElementById("seller-info");
    
    var bookImage = document.getElementById("book-image");
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var isbn = document.getElementById("isbn");
    var condition = document.getElementById("condition");
    var subject = document.getElementById("subject");
    var price = document.getElementById("price");
    var favButton = document.getElementById("fav-button");
    var sellerName = document.getElementById("seller-name");
    var sellerRating = document.getElementById("seller-rating");
    var email = document.getElementById("email");
    var followers = document.getElementById("followers");
    var date = document.getElementById("date");
    var sellerComments = document.getElementById("seller-comments");
    
    var image = bookImage.appendChild(document.createElement('img'));
    image.setAttribute('src', '../images/book_placeholder.jpg');
    
    var titleText = title.appendChild(document.createElement('p'));
    titleText.textContent = "Book Title";
    var authorText = document.createTextNode("Author Name");
    author.appendChild(authorText);
    var isbnText = document.createTextNode("1234567890");
    isbn.appendChild(isbnText);
    var conditionText = document.createTextNode("Barely Used");
    condition.appendChild(conditionText);
    var subjectText = document.createTextNode("Physics");
    subject.appendChild(subjectText);


}




$(window).on('load', function () {
    //load in initial state
    setup();
})