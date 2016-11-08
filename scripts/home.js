(function() {
	data = [{
		image: '../images/book.png',
		title: 'book title',
		price: 'price'
	},
	{
		image: '../images/book.png',
		title: 'another title',
		price: 'another price'
	}];

	for(var i=0; i<data.length; i++) {
		var html = "<div><div><p>"+data[i].title+"</p>";
		html+="<p>"+data[i].price+"</p></div>";
		html += "<div><img src=" + data[i].image + "></img></div></div></br>";
		var searchdiv = document.getElementById('buy-search-div'); 
		
		searchdiv.innerHTML += html;
	}

})();