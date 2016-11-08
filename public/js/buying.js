(function () {
    "use strict";
    var apiUrl = "http://localhost:3000/";
    var books;
    var buyOrders;
    var buyers;
    var isbnString;
    var transactions;

    function setup() {
        getBuyOrders();
        getBuyers();
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

    function getBuyOrders() {
        $.ajax({
            url: apiUrl + "buyOrders",
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
        })
    }

    function getBuyers() {
        $.ajax({
            url: apiUrl + "users",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    buyers = data;
                    console.log("got buyers");
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
        console.log(booksToDisplay);
        buyOrders.forEach(function (order) {
            var thisOrder;
            var thisBuyer;
            var thisBook;
            booksToDisplay.forEach(function (book) {
                if (order.textbook === book._id) {
                    thisOrder = order;
                    thisBook = book;
                    return;
                }
                return;
            })

            var bought = false;
            transactions.forEach(function (transaction) {

                if(order._id === transaction.orderID) {
                    console.log("Found a transaction attached to this buy order!");
                    bought = true;
                    console.log(order);
                    console.log(transaction);
                    return;
                }
                return;
            });

            if (thisOrder && !bought) {
                var bookDiv = listDiv.appendChild(document.createElement('div'));
                bookDiv.className = "book-div";
                var img = $('<img id="book-cover">');
                img.attr('src', 'images/textbookcover.jpg');
                img.appendTo(bookDiv);

                var title = $('<span />').html(thisBook.title);
                title.addClass('book-info');
                title.addClass('book-title');
                title.appendTo(bookDiv);

                var price = $('<span />').html("$" + thisOrder.price);
                price.addClass('book-info');
                price.appendTo(bookDiv);

                buyers.forEach(function (buyer) {
                    if (thisOrder.buyer === buyer._id) {
                        thisBuyer = buyer;
                        return;
                    }
                    return;
                })
                
                img.click(function () {
                    bookClickHandler(thisBook, thisOrder, thisBuyer);
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
        var orderToView = buyOrders.filter(orderWithID)[0];
        var buyerToView = buyers.filter(buyerWithID)[0];

        try {
            // serialize it into a string
            var bookToViewString = JSON.stringify(bookToView);
            sessionStorage.setItem("bookToView", bookToViewString);
            
            var orderToViewString = JSON.stringify(orderToView);
            sessionStorage.setItem("orderToView", orderToViewString);
            
            var buyerToViewString = JSON.stringify(buyerToView);
            sessionStorage.setItem("userToView", buyerToViewString);

            var buyString = JSON.stringify("buy");
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
            buyOrders.sort(lowFirst);
        } else {
            buyOrders.sort(highFirst);
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
        //load in initial state
        setup();
    })

})();