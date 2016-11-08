"use strict";

var apiUrl = "http://localhost:3000/";
var books, currUser, buyOrders, sellOrders, currUserID, buyOrSell, createdBook, allUsers;
var book = new Object();
var order = new Object();

var nameDiv = document.getElementById("name");
var firstNameNode = document.getElementById("firstNameInput");
var nameText = nameDiv.appendChild(document.createElement('p'));
var firstNameInput = document.createElement("textarea");

var lastName = document.getElementById("lastName");
var lastNameNode = document.getElementById("lastNameInput");
var lastNameInput = document.createElement("textarea");

var year = document.getElementById("year");
var yearNode = document.getElementById("yearInput");
var yearText = year.appendChild(document.createElement('p'));
var yearInput = document.createElement("textarea");

var major = document.getElementById("major");
var majorNode = document.getElementById("majorInput");
var majorText = major.appendChild(document.createElement('p'));
var majorInput = document.createElement("textarea");

var sold = document.getElementById("sold");
var soldText = major.appendChild(document.createElement('p'));

var bought = document.getElementById("bought");
var boughtText = major.appendChild(document.createElement('p'));

var profileImage = document.getElementById("profile-image");
var image = profileImage.appendChild(document.createElement('img'));
var imageInput = document.createElement("textarea");
var imageNode = document.getElementById("imageInput");

var ratingNode = document.getElementById("ratingInput");
var isYourProfile = true;

var isSellinghtml = " is selling:</p></div>";
var isBuyinghtml = " is looking for:</p></div>";

var title = document.getElementById("title");
var titleText = title.appendChild(document.createElement('p'));
var titleNode = document.getElementById("titleInput");
var titleInput = document.createElement("textarea");

var authorsNode = document.getElementById("authorsInput");
var authorsInput = document.createElement("textarea");

var ISBNNode = document.getElementById("ISBNInput");
var ISBNInput = document.createElement("textarea");

var conditionNode = document.getElementById("conditionInput");
var conditionInput = document.createElement("textarea");

var courseNode = document.getElementById("courseInput");
var courseInput = document.createElement("textarea");

var subjectNode = document.getElementById("subjectInput");
var subjectInput = document.createElement("textarea");

var priceNode = document.getElementById("priceInput");
var priceInput = document.createElement("textarea");

var commentsNode = document.getElementById("commentsInput");
var commentsInput = document.createElement("textarea");
var sellingdiv = document.getElementById('selling');
var buyingdiv = document.getElementById("buying");

$(document).ready(function () {
	setup();
});

function setup() {
	getAllUsers();
	setTimeout(function () { getCurrentUser() }, 300);
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
				console.log(allUsers);
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
		userToViewString = sessionStorage.getItem("userData");
	} catch (e) {
		alert("Error when reading from Session Storage " + e);
		error = true;
		window.location = "home.html";
		return false;
	}
	if (!error) {
		tempUser = JSON.parse(userToViewString);
		console.log(tempUser);
	}

	allUsers.forEach(function (user) {
		if (user.emailAddress === tempUser.email) {
			currUser = user;
			return;
		}
	});

	if (!currUser) {
		addUser(tempUser);
	}
}

function addUser(tempUser) {
	var newUser =
		{
			'firstName': tempUser.name.split(" ")[0],
			'lastName': tempUser.name.split(" ")[1],
			'emailAddress': tempUser.email,
			'year': 2016,
			'major': 'Undeclared',
			'rating': 0
		};

	$.ajax({
		url: apiUrl + "users/",
		type: 'POST',
		dataType: 'JSON',
		data: newUser,
		success: function (data) {
			if (data) {
				currUser = data;
				console.log("success");
			} else {
				console.log("User info could not be posted");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
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

function populateOrders() {
	isSellinghtml = "<div class='header'><p>" + currUser.firstName + isSellinghtml;
	isBuyinghtml = "<div class='header'><p>" + currUser.firstName + isBuyinghtml;

	var html = "<div id='img'><img id='profilePic' src='images/user-blank.png'></div>"
	html += "<div id='details'><p>" + currUser.firstName + " " + currUser.lastName + "</p>";
	html += "<p>" + currUser.year + ", " + currUser.major + " major</p>";
	html += "<p>Bought: " + currUser.buyHistory.length + " books</p>";
	html += "<p>Sold: " + currUser.sellHistory.length + " books</p>";
	html += "<p>Rating: " + currUser.rating + "/5</p>";
	html += "</div>";

	var info = document.getElementById("info");

	info.innerHTML += html;
	
	var editProfileButton = document.getElementById("editProfile");
	editProfileButton.addEventListener("click", editProfile);

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

	var newSellOrder = $('<button id="sellOrder" class="newBook" href="" onclick="createNewSellOrder()">+ Add New</button>')
	newSellOrder.appendTo(sellDiv);
	var newBuyOrder = $('<button id="buyOrder" class="newBook" href="" onclick="createNewBuyOrder()">+ Add New</button>')
	newBuyOrder.appendTo(buyDiv);
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

function submit() {
	if (isYourProfile) {
		currUser.firstName = firstNameInput.value;
		currUser.lastName = lastNameInput.value;
		currUser.year = yearInput.value;
		currUser.major = majorInput.value;
		currUser.image = imageInput.value;
		saveProfile();
		loadImage(currUser.image);
	} else {
		$(document).ready(function () {
			//load in initial state
			setup();
		});
	}
	closeModal(buyOrSell);
}

function closeRatingModal() {
	var modal = document.getElementById('ratingModal');
	modal.style.display = "none";
	ratingNode.removeChild(ratingNode.firstChild);
}

// Load book from browser session storage
function loadProfile() {
	var error = false;
	var profileToViewString;
	try {
		profileToViewString = sessionStorage.getItem("profileToView");
	} catch (e) {
		alert("Error when reading from Session Storage " + e);
		error = true;
		window.location = "index.html";
		return false;
	}
	if (!error) {
		currUser = JSON.parse(profileToViewString);
	}
}

function loadProfileInfo() {
	var profileDiv = document.getElementById("info");
	nameText.textContent = currUser.firstName + " " + currUser.lastName;
	yearText.textContent = "Year is: " + currUser.year;
	majorText.textContent = currUser.major;
	soldText.textContent = "Sold: " + currUser.sellHistory.length + " books";
	boughtText.textContent = "Bought: " + currUser.buyHistory.length + " books";
}

function getProfiles() {
	$.ajax({
		url: apiUrl + "users/",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				currUser = data[0];
				loadProfileInfo();
				loadImage(currUser.image);
			} else {
				console.log("Book info could not get got");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
}

function saveProfile() {
	$.ajax({
		url: apiUrl + "users/" + currUser._id,
		type: 'PUT',
		data: currUser,
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				loadProfileInfo();
				return false;
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

function createNewSellOrder() {
	buyOrSell = "sell";
	inputBookInfo();
}

function createNewBuyOrder() {
	buyOrSell = "buy";
	inputBookInfo();
}

function createBook() {
	$.ajax({
		url: apiUrl + "books/",
		type: 'POST',
		data: book,
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				createdBook = data;
				order.condition = conditionInput.value;
				order.price = priceInput.value;
				order.textbook = createdBook._id;
				var currentDate = new Date();
				order.datePosted = currentDate.toDateString();
				order.description = commentsInput.value;
				order.favoritedCount = "0";
				if (buyOrSell == "sell") {
					order.seller = currUser._id;
					createSellOrder();
				} else {
					order.buyer = currUser._id;
					createBuyOrder();
				}
			} else {
				console.log("Book could not be created");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
	return;
}

function createSellOrder() {
	$.ajax({
		url: apiUrl + "sellOrders/",
		type: 'POST',
		data: order,
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				sellOrders.push(data);
				location.reload();
			} else {
				console.log("Book could not be created");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
	return;
}

function createBuyOrder() {
	console.log("creating buy order");
	$.ajax({
		url: apiUrl + "buyOrders/",
		type: 'POST',
		data: order,
		dataType: 'JSON',
		success: function (data) {
			if (data) {
				buyOrders.push(data);
				location.reload();
			} else {
				console.log("Buy order could not be created");
			}
		},
		error: function (req, status, err) {
			console.log(err, status, req);
		}
	});
	return;
}

function inputBookInfo() {
	var modal = document.getElementById('bookInfoModal');
	var span = document.getElementsByClassName("close")[2];

	titleInput.setAttribute("rows", "1");
	titleInput.setAttribute("cols", "30");

	authorsInput.setAttribute("rows", "1");
	authorsInput.setAttribute("cols", "30");

	ISBNInput.setAttribute("rows", "1");
	ISBNInput.setAttribute("cols", "30");

	conditionInput.setAttribute("rows", "1");
	conditionInput.setAttribute("cols", "30");

	courseInput.setAttribute("rows", "1");
	courseInput.setAttribute("cols", "30");

	subjectInput.setAttribute("rows", "1");
	subjectInput.setAttribute("cols", "30");

	priceInput.setAttribute("rows", "1");
	priceInput.setAttribute("cols", "30");

	commentsInput.setAttribute("rows", "1");
	commentsInput.setAttribute("cols", "30");

	titleNode.appendChild(titleInput);
	authorsNode.appendChild(authorsInput);
	ISBNNode.appendChild(ISBNInput);
	conditionNode.appendChild(conditionInput);
	courseNode.appendChild(courseInput);
	subjectNode.appendChild(subjectInput);
	priceNode.appendChild(priceInput);
	commentsNode.appendChild(commentsInput);

	var submitBook = document.getElementById("submit-book");
	submitBook.addEventListener("click", closeModal);

	modal.style.display = "block";
	span.onclick = function () {
		closeBookModal();
	}

	window.onclick = function (event) {
		if (event.target == modal) {
			closeBookModal();
		}
	}
}

function closeModal() {
	book.title = titleInput.value;
	book.ISBN = ISBNInput.value;
	book.authors = authorsInput.value;
	book.subject = subjectInput.value;
	book.course = courseInput.value;
	createBook();
}

function closeBookModal() {
	var modal = document.getElementById("bookInfoModal");
	modal.style.display = "none";
}

function closeEditModal() {
	var modal = document.getElementById("myModal");
	console.log(modal);
	modal.style.display = "none";
}


function loadImage(imagePath) {
	image.setAttribute('src', imagePath);
}

function editProfile() {
	console.log("editting profile");
	if (isYourProfile) {
		var modal = document.getElementById('myModal');
		var span = document.getElementsByClassName("close")[0];

		firstNameInput.setAttribute("rows", "1");
		firstNameInput.setAttribute("cols", "30");
		firstNameInput.innerHTML = currUser.firstName;

		lastNameInput.setAttribute("rows", "1");
		lastNameInput.setAttribute("cols", "30");
		lastNameInput.innerHTML = currUser.lastName;

		imageInput.setAttribute("rows", "1");
		imageInput.setAttribute("cols", "30");
		imageInput.innerHTML = currUser.image;

		yearInput.setAttribute("rows", "1");
		yearInput.setAttribute("cols", "30");
		yearInput.innerHTML = currUser.year;

		majorInput.setAttribute("rows", "1");
		majorInput.setAttribute("cols", "30");
		majorInput.innerHTML = currUser.major;

		firstNameNode.appendChild(firstNameInput);
		lastNameNode.appendChild(lastNameInput);
		imageNode.appendChild(imageInput);
		yearNode.appendChild(yearInput);
		majorNode.appendChild(majorInput);


		modal.style.display = "block";
		span.onclick = function () {
			closeEditModal();

		}

		var submitButton = document.getElementById("submit");
		submitButton.addEventListener("click", submit);
		window.onclick = function (event) {
			if (event.target == modal) {
				if (isYourProfile) {
					closeEditModal();
				} else {
					closeRatingModal();
				}
			}
		}
	} else {
		var modal = document.getElementById('ratingModal');
		var span = document.getElementsByClassName("close")[1];

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
}