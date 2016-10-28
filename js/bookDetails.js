function loadImage() {
    var bookImage = document.getElementById("book-image");
    var image = bookImage.appendChild(document.createElement('img'));
    image.setAttribute('src', '../images/book_placeholder.jpg');
}

function loadBookInfo() {
    var bookDiv = document.getElementById("book-info");
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var isbn = document.getElementById("isbn");
    var condition = document.getElementById("condition");
    var subject = document.getElementById("subject");
    var price = document.getElementById("price");    

    var titleText = title.appendChild(document.createElement('p'));
    titleText.textContent = "Book Title";
    var authorText = author.appendChild(document.createElement('p'));
    authorText.textContent = "Author Name"
    var isbnText = isbn.appendChild(document.createElement('p'));
    isbnText.textContent = "123456789";
    var conditionText = condition.appendChild(document.createElement('p'));
    conditionText.textContent = "Barely Used";
    var subjectText = subject.appendChild(document.createElement('p'));
    subjectText.textContent = "Physics";
    var priceText = price.appendChild(document.createElement('p'));
    priceText.textContent = "$45.99";

}

function loadSellerInfo() {
    var sellerDiv = document.getElementById("seller-info");

    var sellerName = document.getElementById("seller-name");
    var sellerRating = document.getElementById("seller-rating");
    var email = document.getElementById("email");
    var followers = document.getElementById("followers");
    var date = document.getElementById("date");
    var sellerComments = document.getElementById("seller-comments");

    var divider = sellerDiv.appendChild(document.createElement('hr'));
    
}

function setup() {
    console.log("setting up");

    var bookDiv = document.getElementById("book-info");
    var sellerDiv = document.getElementById("seller-info");

    loadImage();
    loadBookInfo();
    loadSellerInfo();
    
    var favButton = document.getElementById("fav-button");
}




$(window).on('load', function () {
    //load in initial state
    setup();
})