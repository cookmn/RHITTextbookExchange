$(document).ready(function() {
	const registryToken = "c8950f98-0c9c-485a-b0af-754208d11d08";

	$("#login-button").click(function(){
		Rosefire.signIn(registryToken, function(error, rosefireUser){
			if (error){
				console.log("Error communicating with Rosefire", error);
				return;
			}
			//window.location.replace('/homepage.html?authorization=' + rosefireUser.token);
			console.log(rosefireUser);
			console.log("hey I am back ");
        $.ajax({
            url: "http://localhost:3000/foobar",
            type: 'POST',
            data: rosefireUser,
            dataType: 'JSON',
            success: function (data) {
                if(data) {
                    //redirect to index.html
                    //window.location.href = './homepage.html';
                    // console.log(data);
					// console.log("good stuff");
                    var userData = JSON.stringify(data);
                    // console.log("string thing: " + userData);
                    sessionStorage.setItem("userData", userData);
                    // console.log("this is the data I got" + sessionStorage.getItem("userData"));
                    // var userReturn = sessionStorage.getItem("userData");
                    // console.log(JSON.parse(userReturn));
                    window.location.href = "./home.html";
                    return false;
                } else {
                    console.log('could not be verify rosefire');
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
        return;
		})
	});
});