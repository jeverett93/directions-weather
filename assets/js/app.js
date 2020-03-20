var userStart = $("#inputStart").val().trim()
var userEnd = $("#inputDestination").val().trim()
var submitBtn = $("#submitBtn")
// taste dive api information
var apiKey1 = "AIzaSyDgOE3QM2wQZZgOrdOyhBuX_GF-bgZGhU4"
var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + userStart + "&destination=" + userEnd + "&key=" + apiKey1
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


