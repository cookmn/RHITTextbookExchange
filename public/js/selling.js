(function () {
    "use strict";
    var apiUrl = "http://localhost:3000/";
    var books;
    var sellOrders;
    var sellers;
    var isbnString, subjectString;
    var transactions;

    function setup() {
        getSellOrders();
        getSellers();
        getTransactions();
        setTimeout(function () {getBooks()}, 100);
        setTimeout(function () {getSortForms()}, 100);
    }

    function getBooks() {
        $.ajax({
            url: apiUrl + "books",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    books = data;
                    displayBooks(books);
                } else {
                    console.log("Book info could not get got");
                }
            },
            error: function (req, status, err) {
                console.log(err, status, req);
            }
        })
    }

    function getTransactions() {
        $.ajax({
            url: apiUrl + "transactions/",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    transactions = data;
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
            url: apiUrl + "sellOrders",
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
        })
    }

    function getSellers() {
        $.ajax({
            url: apiUrl + "users",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    sellers = data;
                } else {
                    console.log("User info could not get got");
                }
            },
            error: function (req, status, err) {
                console.log(err, status, req);
            }
        })
    }

    function displayBooks(booksToDisplay) {
        var listDiv = document.getElementById("book-list");
        listDiv.innerHTML = "";
        sellOrders.forEach(function (order) {
            var thisOrder;
            var thisSeller;
            var thisBook;
            booksToDisplay.forEach(function (book) {
                if (order.textbook === book._id) {
                    thisOrder = order;
                    thisBook = book;
                    return;
                }
                return;
            })

            var sold = false;
            transactions.forEach(function (transaction) {

                if(order._id === transaction.orderID) {
                    console.log("Found a transaction attached to this buy order!");
                    sold = true;
                    console.log(order);
                    console.log(transaction);
                    return;
                }
                return;
            });

            if (thisOrder && !sold) {
                var bookDiv = listDiv.appendChild(document.createElement('div'));
                bookDiv.className = "book-div";
                var img = $('<img id="book-cover">');
                img.attr('src', thisBook.imagePath);
                img.appendTo(bookDiv);

                var title = $('<span />').html(thisBook.title);
                title.addClass('book-info');
                title.addClass('book-title');
                title.appendTo(bookDiv);

                var price = $('<span />').html("$" + thisOrder.price);
                price.addClass('book-info');
                price.appendTo(bookDiv);

                sellers.forEach(function (seller) {
                    if (thisOrder.seller === seller._id) {
                        thisSeller = seller;
                        return;
                    }
                    return;
                })
                
                img.click(function () {
                    bookClickHandler(thisBook, thisOrder, thisSeller);
                });
            }
        });
    }

    // save contact to update in browser storage and go to update page
    function bookClickHandler(book, order, buyer) {
        var error = false;
        function bookWithID(thisbook) {
            return thisbook._id === book._id;
        }

        function orderWithID(thisorder) {
            return thisorder._id === order._id;
        }

        function buyerWithID(thisbuyer) {
            return thisbuyer._id === buyer._id;
        }

        var bookToView = books.filter(bookWithID)[0];
        var orderToView = sellOrders.filter(orderWithID)[0];
        var sellerToView = sellers.filter(buyerWithID)[0];

        try {
            // serialize it into a string
            var bookToViewString = JSON.stringify(bookToView);
            sessionStorage.setItem("bookToView", bookToViewString);
            
            var orderToViewString = JSON.stringify(orderToView);
            sessionStorage.setItem("orderToView", orderToViewString);
            
            var sellerToViewString = JSON.stringify(sellerToView);
            sessionStorage.setItem("userToView", sellerToViewString);

            var buyString = JSON.stringify("sell");
            sessionStorage.setItem("buyOrSell", buyString);
        } catch (e) {
            alert("Error when writing to Session Storage " + e);
            error = true;
        }
        if (!error) {
            window.location = "bookDetails.html";
            return false;
        }
    }

        function getSortForms() {
        var sortBySubject = $('#sort-subject');
        var sortByPrice = document.getElementById("sort-price");
        var findByIsbn = $('#sort-isbn');

        sortBySubject.on('input', function() {
            subjectString = $(this).val();
            console.log(subjectString);
            filterBooksBySubject(subjectString);
        })

        sortByPrice.addEventListener("change", function() {
            var price = sortByPrice.value;
            filterBooksByPrice(price);
        })

        findByIsbn.on('input', function() {
            isbnString = $(this).val();
            filterBooksByISBN(isbnString);
        })
    }

    function filterBooksBySubject(subject) {
        var newBooks = [];
        books.forEach(function(book) {
            if (book.subject.toString().includes(subject)) {
                newBooks.push(book);
            }
        });
        displayBooks(newBooks);
    }

    function filterBooksByPrice(price) {
        if (price === "low") {
            sellOrders.sort(lowFirst);
        } else {
            sellOrders.sort(highFirst);
        }

        displayBooks(books);
    }

    function lowFirst(a, b) {
        if (a.price > b.price) {
            return 1;
        }
        if (a.price < b.price) {
            return -1;
        }
        return 0;
    }

    function highFirst(a, b) {
        if (a.price > b.price) {
            return -1;
        }
        if (a.price < b.price) {
            return 1;
        }
        return 0;
    }

    function filterBooksByISBN(isbn) {
        var newBooks = [];
        books.forEach(function(book) {
            if (book.ISBN.toString().includes(isbn)) {
                newBooks.push(book);
            }
        });
        displayBooks(newBooks);
    }

    $(window).on('load', function () {
        validateUser();
        setup();
    })

    function validateUser() {
        if (!JSON.parse(sessionStorage.getItem("userData"))) {
            window.location.href = "./login.html";
        }
    }

})();