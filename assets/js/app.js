var userStart;
var userEnd;
var startState;
var endState;
var submitBtn = $("#submitBtn");
var directions = $("#directions-info");
var currentWeather = $("#current-weather");
// taste dive api information
var apiKey1 = "AIzaSyBan-c0mRECIQzo4yd6oGeBeosVcJNFaPw"

// weather variables
//moment
var momentTime = moment().format("MMMM Do YYYY");
//variables
var APIKey = "e885fd3db621744dfef49f4c1e174dc6";



function getDirections() {

    var userStart = $("#inputStart").val().trim();
    var userEnd = $("#inputDestination").val().trim();
    var startState = $("#startState").val().trim();
    var endState = $("#endState").val().trim();

    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + userStart + "," + startState + "&destination=" + userEnd + "," + endState + "&key=" + apiKey1

    $.ajax({
        url: queryURL,
        method: "GET",
    })

        .then(function (response) {
            console.log(response);

            directions.empty();

            $('<h3>').text("Distance: " + response.routes[0].legs[0].distance.text).appendTo(directions)
            $('<h3>').text("Driving Duration: " + response.routes[0].legs[0].duration.text).appendTo(directions)



            var distanceText = (response.routes[0].legs[0].distance.text).replace(/,/g, '');
            var tripDistance = parseInt(distanceText);

            console.log(tripDistance);

            if (tripDistance > 500) {
                // var flightOption = 
                // var card = $('<div class ="card">');
                // var cardBody = $('<div class="card-body">');
                // // var yesBtn =
                // // var noBtn = 
                // $('<p class="card-text">').text("Do you want to book a flight").appendTo(cardBody);
                // $('<button class="card-text">').attr("href", "https://www.expedia.com/Flights").text("Yes")
                // $('<button class="card-text">').text("No, I'd rather drive").appendTo(cardBody);
                // cardBody.appendTo(card);
                // card.appendTo(directions);

                // $("<p>").html("Might want to book a flight!").appendTo(directions);

                var flightLink = $("<a>")
                flightLink.attr("href", "https://www.expedia.com/Flights").text("Book a flight!");
                flightLink.appendTo(directions);
            }

            // <a href="https://www.expedia.com/Flights>Checkout some flights on Expedia!</a>"


            else {
                for (i = 0; i < response.routes[0].legs[0].steps.length; i++) {

                    // var newDirection = $("<p>");
                    var directionDistance = response.routes[0].legs[0].steps[i].distance.text;
                    var directionDuration = response.routes[0].legs[0].steps[i].duration.text;
                    var directionInstruction = response.routes[0].legs[0].steps[i].html_instructions;



                    $("<p>").text(directionDistance).appendTo(directions);
                    $("<p>").text(directionDuration).appendTo(directions);
                    $("<p>").html(directionInstruction).appendTo(directions);




                }
            }




        });
    getCurrentWeather();
}

// function to get the current weather
function getCurrentWeather() {
    // var destinatonInput = $('#cityInput').val().trim();
    console.log(userEnd);

    var userEnd = $("#inputDestination").val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userEnd + "&appid=" + APIKey;

    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Nashville&appid=" + APIKey;

    // Running AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (weatherData) {

            console.log(weatherData);
            // converting temperatures from Kelvin to Fahrenheit 
            var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
            var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

            // adding icons to weather condition
            var imgIcon = $('<img>');
            imgIcon.attr('class', 'image');
            imgIcon.attr('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');

            currentWeather.empty();
            $('#icon').empty();

            // formatting current weather data and icons
            $('#icon').append(imgIcon)
            $('<h3>').text("City: " + weatherData.name).appendTo(currentWeather)
            $('<h3>').text("Date: " + momentTime).appendTo(currentWeather)
            $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather)
            $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather)
            $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
            $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather)

            // variables holding latitude and longitude 
            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            //Adds the UV Index to current weather
            var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: queryURL2,
                method: "GET"
            })
                // Getting UV index and color code for index
                .then(function (moreData) {
                    $('<h3 id = ' + city + '>').text("UV Index: " + moreData.value).appendTo(currentWeather);

                    if (moreData.value <= 2) {
                        $('#' + city).addClass('green');
                    }
                    else if (moreData.value <= 5) {
                        $('#' + city).addClass('yellow');
                    }
                    else if (moreData.value <= 7) {
                        $('#' + city).addClass('orange');
                    }
                    else if (moreData.value <= 10) {
                        $('#' + city).addClass('red');
                    }
                    else if (moreData.value > 10) {
                        $('#' + city).addClass('purple');
                    }

                });


        });



};




$(document).ready(function () {

    submitBtn.on("click", function (event) {
        event.preventDefault();
        getDirections();
        $("#inputStart").val("");
        $("#startState").val("");
        $("#inputDestination").val("");
        $("#endState").val("");


    });


});


