function setup() {
    getBooks();
    displayBooks();
}

function getBooks() {
    // make an ajax call to get the books?
    // on success call displayBooks
}

function displayBooks() {
    var listDiv = document.getElementById("book-list");
    //books.forEach(function (book) {
        var bookDiv = listDiv.appendChild(document.createElement('div'));
        bookDiv.className = "book-div";

        var img = $('<img id="book-cover">'); 
        img.attr('src', '../images/textbookcover.jpg');
        img.appendTo(bookDiv);

        var title = $('<span />').html('Book Title');
        title.addClass('book-info');
        title.addClass('book-title');
        title.appendTo(bookDiv);
   
        var price = $('<span />').html('$67.89');
        price.addClass('book-info');
        price.appendTo(bookDiv);
   // });

}

$(window).on('load', function () {
    //load in initial state
    setup();
})