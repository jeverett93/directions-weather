var userStart = $("#inputStart").val()
var userEnd = $("#inputDestination").val()
var submitBtn = $("#submitBtn")
// taste dive api information
var apiKey1 = "AIzaSyBan-c0mRECIQzo4yd6oGeBeosVcJNFaPw"
// var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + userStart + "&destination=" + userEnd + "&key=" + apiKey1

var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=3201+Dickerson+Pike&destination=3441+Dickerson+Pike&key=" + apiKey1

// omdb api information


function getDirections() {
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    
    .then(function(response){
        console.log(response);
    });
}



$(document).ready(function(){

submitBtn.on("click", function(event){
    event.preventDefault();
    getDirections();
    console.log(userStart);
    console.log(userEnd);
    
});


});


