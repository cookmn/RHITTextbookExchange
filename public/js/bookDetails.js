"use strict";
var apiUrl = "http://localhost:3000/";
var book;
var user;
var order;
var buyOrSell;
var editForm = false;
var isYourBook = true;
var userID = 1;
var currentUser;

var title = document.getElementById("title");
var titleText = title.appendChild(document.createElement('p'));
var titleNode = document.getElementById("titleInput");
var titleInput = document.createElement("textarea");

var author = document.getElementById("author");
var authorText = author.appendChild(document.createElement('p'));
var authorsNode = document.getElementById("authorsInput");
var authorsInput = document.createElement("textarea");

var isbn = document.getElementById("isbn");
var isbnText = isbn.appendChild(document.createElement('p'));
var ISBNNode = document.getElementById("ISBNInput");
var ISBNInput = document.createElement("textarea");

var condition = document.getElementById("condition");
var conditionText = condition.appendChild(document.createElement('p'));
var conditionNode = document.getElementById("conditionInput");
var conditionInput = document.createElement("textarea");

var course = document.getElementById("course");
var courseText = course.appendChild(document.createElement('p'));
var courseNode = document.getElementById("courseInput");
var courseInput = document.createElement("textarea");

var subject = document.getElementById("subject");
var subjectText = subject.appendChild(document.createElement('p'));
var subjectNode = document.getElementById("subjectInput");
var subjectInput = document.createElement("textarea");

var price = document.getElementById("price");
var priceText = price.appendChild(document.createElement('p'));
var priceNode = document.getElementById("priceInput");
var priceInput = document.createElement("textarea");

var sellerComments = document.getElementById("seller-comments");
var commentsText = sellerComments.appendChild(document.createElement('p'));
var commentsNode = document.getElementById("commentsInput");
var commentsInput = document.createElement("textarea");

// Load book from browser session storage
function loadBook() {
    var error = false;
    var bookToViewString;
    var orderToViewString;
    var userToViewString;
    try {
        bookToViewString = sessionStorage.getItem("bookToView");
        orderToViewString = sessionStorage.getItem("orderToView");
        userToViewString = sessionStorage.getItem("userToView");
    } catch (e) {
        alert("Error when reading from Session Storage " + e);
        error = true;
        window.location = "index.html";
        return false;
    }
    if (!error) {
        book = JSON.parse(bookToViewString);
        user = JSON.parse(userToViewString);
        order = JSON.parse(orderToViewString);
    }
}

function getBook() {
    $.ajax({
        url: apiUrl + "books/" + book._id,
        type: 'GET',
        data: book,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                book = data;
            } else {
                console.log("Book info could not be updated");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    })
}

function saveBook() {
    $.ajax({
        url: apiUrl + "books/" + book._id,
        type: 'PUT',
        data: book,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                return false;
            } else {
                console.log("Book info could not be updated");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    });
    return;
}

function saveOrder() {
    if (buyOrSell === "buy") {
        var urlSecondPart = "buyOrders/";
    } else if (buyOrSell === "sell") {
        urlSecondPart = "sellOrders/";
    } else {
        closeModal();
        return;
    }
    $.ajax({
        url: apiUrl + urlSecondPart + order._id,
        type: 'PUT',
        data: order,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                closeModal();
                loadBookInfo();
                return false;
            } else {
                console.log("Book info could not be updated");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
            var errorMsg = document.getElementById('error-msg');
            errorMsg.style.color = 'red';
            errorMsg.textContent = "Price is not a number, please enter a valid number.";
        }
    });
    return;
}

function deleteBook() {
    $.ajax({
        url: apiUrl + book._id,
        type: 'DELETE',
        data: book,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                //redirect to their profile?
            } else {
                console.log("Book could not be deleted");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    });
    return;
}

function loadImage() {
    var bookImage = document.getElementById("book-image");
    var image = bookImage.appendChild(document.createElement('img'));
    image.setAttribute('src', 'images/book_placeholder.jpg');
}

function loadBookInfo() {
    var bookDiv = document.getElementById("book-info");
    titleText.textContent = book.title;
    authorText.textContent = book.authors;
    isbnText.textContent = "ISBN: " + book.ISBN;
    conditionText.textContent = "Condition: " + order.condition;
    subjectText.textContent = "Subject: " + book.subject;
    courseText.textContent = "Class: " + book.course;
    priceText.textContent = "$" + order.price;
}

function loadBuyerInfo() {
    var sellerDiv = document.getElementById("seller-info");

    var sellerName = document.getElementById("seller-name");
    var sellerRating = document.getElementById("seller-rating");
    var email = document.getElementById("email");
    var followers = document.getElementById("followers");
    var date = document.getElementById("date");
    var sellerComments = document.getElementById("seller-comments");


    var sellerNameText = sellerName.appendChild(document.createElement('p'));
    sellerNameText.textContent = "Seller: " + user.firstName + " " + user.lastName;
    var sellerRatingText = sellerRating.appendChild(document.createElement('p'));
    sellerRatingText.textContent = "Rating : " + user.rating + " stars";
    var emailText = email.appendChild(document.createElement('p'));
    emailText.innerHTML = '<a href="mailto:' + user.emailAddress + '">Send ' + user.firstName + ' an email!</a>';

    var followersText = followers.appendChild(document.createElement('p'));
    followersText.textContent = "Current post followers: " + order.favoritedCount;
    var dateText = date.appendChild(document.createElement('p'));
    dateText.textContent = "Originally posted on: " + order.datePosted.substring(0, 10);

    if (order.seller) {
        var commentsText = sellerComments.appendChild(document.createElement('p'));
        commentsText.textContent = "Seller Comments: " + order.description;
    }
}

function getCurrentUserID() {
    $.ajax({
        url: apiUrl + "users/",
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                data.forEach(function (user) {
                    if (user.emailAddress === JSON.parse(sessionStorage.getItem("userData")).email) {
                        currentUser = user;
                        return;
                    }
                    return;
                });
                // console.log(currUser);
            } else {
                console.log("User info could not get got");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    })
}

function favoriteHandler() {
    var favorite = document.getElementById("favorite"); 
    var favSpan = document.getElementById("favorited");
    if (favorite.innerHTML === "Favorite Book") {
        favorite.innerHTML = "Unfavorite Book";
        favSpan.style.visibility = "visible";
        //make ajax PUT request
    } else {
        favorite.innerHTML = "Favorite Book";
        favSpan.style.visibility = "hidden";
        //make ajax PUT request
    }
}

function buyBook() {
    var transaction = {
        isBuy: true,
        orderID: JSON.parse(sessionStorage.getItem("orderToView"))._id,
        customerID: currentUser._id,
        priceOfTransaction: JSON.parse(sessionStorage.getItem("orderToView")).price
    };

    console.log(transaction);

    $.ajax({
        url: apiUrl + "transactions/",
        type: 'POST',
        data: transaction,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                console.log(data);
            } else {
                console.log("error posting");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    });
}

function sellBook() {
    console.log("You just called sellBook()!");

    var transaction = {
        isBuy: false,
        orderID: JSON.parse(sessionStorage.getItem("orderToView"))._id,
        customerID: currentUser._id,
        priceOfTransaction: JSON.parse(sessionStorage.getItem("orderToView")).price
    };

    console.log(transaction);

    $.ajax({
        url: apiUrl + "transactions/",
        type: 'POST',
        data: transaction,
        dataType: 'JSON',
        success: function (data) {
            if (data) {
                console.log(data);
            } else {
                console.log("error posting");
            }
        },
        error: function (req, status, err) {
            console.log(err, status, req);
        }
    });    
}

function editBook() {
    if (isYourBook) {
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];

        titleInput.setAttribute("rows", "1");
        titleInput.setAttribute("cols", "30");
        titleInput.innerHTML = book.title;

        authorsInput.setAttribute("rows", "1");
        authorsInput.setAttribute("cols", "30");
        authorsInput.innerHTML = book.authors;

        ISBNInput.setAttribute("rows", "1");
        ISBNInput.setAttribute("cols", "30");
        ISBNInput.innerHTML = book.ISBN;

        conditionInput.setAttribute("rows", "1");
        conditionInput.setAttribute("cols", "30");
        conditionInput.innerHTML = order.condition;

        courseInput.setAttribute("rows", "1");
        courseInput.setAttribute("cols", "30");
        courseInput.innerHTML = book.course;

        subjectInput.setAttribute("rows", "1");
        subjectInput.setAttribute("cols", "30");
        subjectInput.innerHTML = book.subject;

        priceInput.setAttribute("rows", "1");
        priceInput.setAttribute("cols", "30");
        priceInput.innerHTML = order.price;

        commentsInput.setAttribute("rows", "1");
        commentsInput.setAttribute("cols", "30");
        commentsInput.innerHTML = order.description;

        titleNode.appendChild(titleInput);
        authorsNode.appendChild(authorsInput);
        ISBNNode.appendChild(ISBNInput);
        conditionNode.appendChild(conditionInput);
        courseNode.appendChild(courseInput);
        subjectNode.appendChild(subjectInput);
        priceNode.appendChild(priceInput);
        commentsNode.appendChild(commentsInput);

        var submitButton = document.getElementById("submit");
        submitButton.addEventListener("click", submit);

        modal.style.display = "block";
        span.onclick = function () {
            closeModal();
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                closeModal();
            }
        }

    } else {

    }
}

function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    authorsNode.removeChild(authorsNode.firstChild);
    ISBNNode.removeChild(ISBNNode.firstChild);
    conditionNode.removeChild(conditionNode.firstChild);
    courseNode.removeChild(courseNode.firstChild);
    subjectNode.removeChild(subjectNode.firstChild);
    priceNode.removeChild(priceNode.firstChild);
    titleNode.removeChild(titleNode.firstChild);
    commentsNode.removeChild(commentsNode.firstChild);
}

function submit() {
    if (isYourBook) {
        book.title = titleInput.value;
        book.ISBN = ISBNInput.value;
        book.authors = authorsInput.value;
        book.subject = subjectInput.value;
        order.condition = conditionInput.value;
        book.course = courseInput.value;
        order.price = priceInput.value;
        saveBook();
        saveOrder();
    } else {

    }
}

$(document).ready(function () {
    loadBook();
    if (JSON.parse(sessionStorage.getItem("userData")).email === JSON.parse(sessionStorage.getItem("userToView")).emailAddress) {
        editForm = true;
    } else {
        editForm = false;
    }
    console.log(editForm);
    loadImage();
    setup();
});

function setup() {
    getCurrentUserID();
    loadBookInfo();
    loadBuyerInfo();

    var editBookButton = document.getElementById("buySellEdit");
    var favoriteButton = document.getElementById("favorite");
    var functionToCall;
    if(editForm) {
        editBookButton.innerHTML = "Edit Book";
        functionToCall = editBook;
        console.log("this is your order");
        favoriteButton.style.visibility = "hidden";

        if (JSON.parse(sessionStorage.getItem("orderToView")).buyer) {
            buyOrSell = "buy";
        } else {
            buyOrSell = "sell";
        }

    } else if (JSON.parse(sessionStorage.getItem("orderToView")).buyer) {
        favoriteButton.innerHTML = "Favorite Book";
        editBookButton.innerHTML = "Sell Book";
        functionToCall = sellBook;
        console.log("this is a sell order");

    } else {
        editBookButton.innerHTML = "Buy Book";
        favoriteButton.innerHTML = "Favorite Book";
        functionToCall = buyBook;
        console.log("this is a buy order");

    }
    editBookButton.addEventListener("click", function () { functionToCall() }, false);
    favoriteButton.addEventListener("click", function () { favoriteHandler() }, false);
    // if (isYourBook) {
        // editBookButton.innerHTML = "Edit Book";
    // }
}

