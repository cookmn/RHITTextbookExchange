(function() {
	"use strict";
	var apiUrl = "http://localhost:3000/";
	var books, buyOrders, sellOrders, users;

	function setup() {

		getBuyOrders();
		getSellOrders();
		getUsers();
		getBooks();
		setTimeout(function () {populateOrders()}, 150);
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

	function getUsers() {
		$.ajax({
            url: apiUrl + "users",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    users = data;
                } else {
                    console.log("User info could not get got");
                }
            },
            error: function (req, status, err) {
                console.log(err, status, req);
            }
        })
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
                    console.log("Books could not get got");
                }
            },
            error: function (req, status, err) {
                console.log(err, status, req);
            }
    	});
	}

	function populateOrders() {
		var buyDiv = document.getElementById('buy-search-div');
		for(var i=0; i<5; i++) {
			var thisUser, thisBook, thisOrder; 

			if(!buyOrders[i]) {
				continue;
			}

			books.forEach(function (book) {
				if(buyOrders[i].textbook === book._id) {
					thisOrder = buyOrders[i];
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
			var img = document.createElement('img');
			img.setAttribute('src', 'images/textbookcover.jpg');
			imgDiv.appendChild(img);

			users.forEach(function (user) {
				if (user._id === thisOrder.buyer) {
					thisUser = user;
					return;
				}
				return;
			});

			stupidClosures(img, thisBook, thisOrder, thisUser);
		}

// ----------------------------------------------------------------------------------------------

		var sellDiv = document.getElementById('sell-search-div');
		for(var i=0; i<5; i++) {
			var thisUser, thisBook, thisOrder;

			if(!sellOrders[i]) {
				continue;
			}

			books.forEach(function (book) {
				if(sellOrders[i].textbook === book._id) {
					thisOrder = sellOrders[i];
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
			var img = document.createElement('img');
			img.setAttribute('src', 'images/textbookcover.jpg');
			imgDiv.appendChild(img);

			users.forEach(function (user) {
				if (user._id === thisOrder.seller) {
					thisUser = user;
					return;
				}
				return;
			});
    		stupidClosures(img, thisBook, thisOrder, thisUser);
		}
	}

	function stupidClosures(img, book, order, user) {
		img.addEventListener("click", function () {
			bookClickHandler(book, order, user)
		}, false);

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

	$(window).on('load', function () {
		validateUser();
        setup();
    });

	function validateUser() {
		if (!JSON.parse(sessionStorage.getItem("userData"))) {
			window.location.href = "./login.html";
		}
	}

})();