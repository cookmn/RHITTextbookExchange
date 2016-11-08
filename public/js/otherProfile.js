"use strict";

var apiUrl = "http://localhost:3000/";
var books, currUser, buyOrders, sellOrders, currUserID, buyOrSell, createdBook, allUsers;
var book = new Object();
var order = new Object();

var ratingNode = document.getElementById("ratingInput");
var isYourProfile = true;

var isSellinghtml = " is selling:</p></div>";
var isBuyinghtml = " is looking for:</p></div>";

var sellingdiv = document.getElementById('selling');
var buyingdiv = document.getElementById("buying");

$(document).ready(function () {
	setup();
});

function setup() {
	getAllUsers();
	setTimeout(function () { getCurrentUser() }, 100);
	getBuyOrders();
	getSellOrders();
	getBooks();
	setTimeout(function () { populateOrders() }, 800);
}

function getAllUsers() {
	$.ajax({
		url: apiUrl + "users/",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				allUsers = data;
			} else {
				console.log("User info could not get got");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
}

function getCurrentUser() {
	var error = false;
	var userToViewString;
	var tempUser;
	try {
		userToViewString = sessionStorage.getItem("buyerOrSellerToView");
		console.log("user to view is: ");
		console.log(userToViewString);
	} catch (e) {
		alert("Error when reading from Session Storage " + e);
		error = true;
		window.location = "home.html";
		return false;
	}
	if (!error) {
		currUser = JSON.parse(userToViewString);
		console.log("currUser is: ");
		console.log(currUser);
	}
}

function getBuyOrders() {
	$.ajax({
		url: apiUrl + "buyOrders/",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				buyOrders = data;
			} else {
				console.log("Buy order info could not get got");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
}

function getBooks() {
	$.ajax({
		url: apiUrl + "books/",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				books = data;
			} else {
				console.log("Buy order books could not get got");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
}

function getSellOrders() {
	$.ajax({
		url: apiUrl + "sellOrders/",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				sellOrders = data;
			} else {
				console.log("Sell order info could not get got");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
}

function calculateRating(){
	var ratings = currUser.rating;
	var numRatings = 0;
	var ratingsTotal = 0;
	ratings.forEach(function (rating) {
		numRatings++;
		ratingsTotal += rating;
	});
	return ratingsTotal / numRatings;
}

function populateOrders() {
	var rating = calculateRating();
	isSellinghtml = "<div class='header'><p>" + currUser.firstName + isSellinghtml;
	isBuyinghtml = "<div class='header'><p>" + currUser.firstName + isBuyinghtml;

	var html = "<div id='img'><img id='profilePic' src='images/user-blank.png'></div>"
	html += "<div id='details'><p>" + currUser.firstName + " " + currUser.lastName + "</p>";
	html += "<p>" + currUser.year + ", " + currUser.major + " major</p>";
	html += "<p>Bought: " + currUser.buyHistory.length + " books</p>";
	html += "<p>Sold: " + currUser.sellHistory.length + " books</p>";
	html += "<p>Rating: " + rating + "/5</p>";
	html += "</div>";

	var info = document.getElementById("info");

	info.innerHTML += html;

	var rateButton = document.getElementById("rateUser");
	rateButton.addEventListener("click", showRatingModal);

	var sellDiv = document.getElementById('selling');
	sellDiv.innerHTML = "";
	sellDiv.innerHTML += isSellinghtml;
	sellOrders.forEach(function (sellOrder) {
		if (sellOrder.seller === currUser._id) {
			var thisBook, thisOrder;

			books.forEach(function (book) {
				if (sellOrder.textbook === book._id) {
					thisOrder = sellOrder;
					thisBook = book;
					return;
				}
				return;
			});

			var bookDiv = sellDiv.appendChild(document.createElement('div'));
			var textDiv = bookDiv.appendChild(document.createElement('div'));

			var title = document.createElement('p');
			title.innerHTML = thisBook.title;
			textDiv.appendChild(title);
			var price = document.createElement('p');
			price.innerHTML = "$" + thisOrder.price;
			textDiv.appendChild(price);

			var imgDiv = bookDiv.appendChild(document.createElement('div'));
			var img = $('<img class="sell-image">');
			img.attr('src', 'images/textbookcover.jpg');
			img.appendTo(imgDiv);
			img.click(function () {
				bookClickHandler(thisBook, thisOrder, currUser);
			});
		}
	});

	var buyDiv = document.getElementById('buying');
	buyDiv.innerHTML = "";
	buyDiv.innerHTML += isBuyinghtml;
	buyOrders.forEach(function (buyOrder) {
		if (buyOrder.buyer === currUser._id) {
			var thisBook, thisOrder;

			books.forEach(function (book) {
				if (buyOrder.textbook === book._id) {
					thisOrder = buyOrder;
					thisBook = book;
					return;
				}
				return;
			});

			var bookDiv = buyDiv.appendChild(document.createElement('div'));
			var textDiv = bookDiv.appendChild(document.createElement('div'));

			var title = document.createElement('p');
			title.innerHTML = thisBook.title;
			textDiv.appendChild(title);
			var price = document.createElement('p');
			price.innerHTML = "$" + thisOrder.price;
			textDiv.appendChild(price);

			var imgDiv = bookDiv.appendChild(document.createElement('div'));
			var img = $('<img class="sell-image">');
			img.attr('src', 'images/textbookcover.jpg');
			img.appendTo(imgDiv);
			img.click(function () {
				bookClickHandler(thisBook, thisOrder, currUser);
			});
		}
	});
}


function bookClickHandler(book, order, user) {
	var error = false;

	try {
		// serialize it into a string
		var bookToViewString = JSON.stringify(book);
		sessionStorage.setItem("bookToView", bookToViewString);

		var orderToViewString = JSON.stringify(order);
		sessionStorage.setItem("orderToView", orderToViewString);

		var userToViewString = JSON.stringify(user);
		sessionStorage.setItem("userToView", userToViewString);
	} catch (e) {
		alert("Error when writing to Session Storage " + e);
		error = true;
	}
	if (!error) {
		window.location = "bookDetails.html";
		return false;
	}
}

function showRatingModal() {
	console.log("rating");
	var modal = document.getElementById('ratingModal');
	var span = document.getElementsByClassName("close")[0];

	var ratingInput = document.createElement("textarea");
	ratingInput.setAttribute("rows", "1");
	ratingInput.setAttribute("cols", "30");
	ratingInput.innerHTML = "1";

	ratingNode.appendChild(ratingInput);

	modal.style.display = "block";
	span.onclick = function () {
		closeRatingModal();
	}
	window.onclick = function (event) {
		if (event.target == modal) {
			closeRatingModal();
		}
	}
}

function closeRatingModal() {
	var modal = document.getElementById('ratingModal');
	//var ratings = currUser.rating;
	//console.log(ratings);
	//ratings.push(1);
	//console.log(ratings);
	console.log(currUser.rating);
	currUser.rating.push(1);
	console.log(currUser.rating);
	saveProfile();
	console.log(currUser.rating);
	//console.log(currUser.rating);
	modal.style.display = "none";
	ratingNode.removeChild(ratingNode.firstChild);
}

	function saveProfile() {
	$.ajax({
		url: apiUrl + "users/" + currUser._id,
		type: 'PUT',
		data: currUser,
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				console.log("putting user data");
				console.log(currUser);
			} else {
				console.log("Profile info could not be updated");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
	return;
}

function loadProfileInfo() {
	var profileDiv = document.getElementById("info");
	nameText.textContent = currUser.firstName + " " + currUser.lastName;
	yearText.textContent = "Year is: " + currUser.year;
	majorText.textContent = currUser.major;
	soldText.textContent = "Sold: " + currUser.sellHistory.length + " books";
	boughtText.textContent = "Bought: " + currUser.buyHistory.length + " books";
}

function loadImage(imagePath) {
	image.setAttribute('src', imagePath);
}