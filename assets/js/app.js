// global variables 
var startAddress;
var endAddress;
var userStart;
var userEnd;
var startState;
var endState;
var submitBtn = $("#submitBtn");
var directions = $("#directions-info");
var currentWeather = $("#current-weather");

// hides these divs and their elements when they aren't being used
$(".weather-div").hide();

$(".directions-div").hide();

//google maps api key
var apiKey1 = "AIzaSyBan-c0mRECIQzo4yd6oGeBeosVcJNFaPw"

//open weather API key
var APIKey = "e885fd3db621744dfef49f4c1e174dc6";

//moment
var momentTime = moment().format("MMMM Do YYYY");

// function that renders directions
function getDirections() {

    // variables to grab input values from page
    var startAddress = $("#startAddress").val().trim();
    var startAddressSplice = startAddress.split(' ');
    var startAddressFinal = startAddressSplice.join("+");

    var endAddress = $("#destinationAddress").val().trim();
    var endAddressSplice = endAddress.split(' ');
    var endAddressFinal = endAddressSplice.join("+");

    var userStart = $("#inputStart").val().trim();
    var userEnd = $("#inputDestination").val().trim();
    var startState = $("#startState").val().trim();
    var endState = $("#endState").val().trim();

    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + startAddressFinal + "," + userStart + "," + startState + "&destination=" + endAddressFinal + "," + userEnd + "," + endState + "&key=" + apiKey1

    $.ajax({
        url: queryURL,
        method: "GET",
    })

        .then(function (response) {
            directions.empty();
            $(".directions-div").show();

            // printing distance and duration info to page
            $('<h3>').text("Distance: " + response.routes[0].legs[0].distance.text).appendTo(directions)
            $('<h3>').text("Driving Duration: " + response.routes[0].legs[0].duration.text).appendTo(directions)

            // taking commas out of distance so it can read as an integer
            var distanceText = (response.routes[0].legs[0].distance.text).replace(/,/g, '');
            var tripDistance = parseInt(distanceText);

            // renders flight option if distance is over 500 miles or driving instructions if they choose to drive
            if (tripDistance > 500) {
                var h3 = $("<h3>")
                h3.text("Might want to book a flight!").appendTo(directions);
                var card = $('<div class ="card">');
                var cardBody = $('<div class="card-body">');
                var flightLink = $("<a>");
                var yesBtn = $("<button>").text("Book a flight!");
                var noBtn = $("<button>").text("I'd rather drive!");
                noBtn.on("click", function () {
                    for (i = 0; i < response.routes[0].legs[0].steps.length; i++) {
                        var directionDistance = response.routes[0].legs[0].steps[i].distance.text;
                        var directionDuration = response.routes[0].legs[0].steps[i].duration.text;
                        var directionInstruction = response.routes[0].legs[0].steps[i].html_instructions;

                        // printing direction instructions to page
                        var $li = $("<li>");
                        $("<span>").text(directionDistance).appendTo($li);
                        $("<span>").text(directionDuration).appendTo($li);
                        $("<span>").html(directionInstruction).appendTo($li);
                        $li.appendTo(directions);
                        flightLink.hide();
                        noBtn.hide();
                        h3.hide();
                    }
                })
                flightLink.attr("href", "https://www.expedia.com/Flights");
                yesBtn.appendTo(flightLink);
                flightLink.appendTo(cardBody);
                noBtn.appendTo(cardBody);
                cardBody.appendTo(card);
                card.appendTo(directions);
            }

            else {
                for (i = 0; i < response.routes[0].legs[0].steps.length; i++) {

                    var directionDistance = response.routes[0].legs[0].steps[i].distance.text;
                    var directionDuration = response.routes[0].legs[0].steps[i].duration.text;
                    var directionInstruction = response.routes[0].legs[0].steps[i].html_instructions;

                    // printing direction instructions to page
                    var $li = $("<li>");
                    $("<span>").text(directionDistance).appendTo($li);
                    $("<span>").text(directionDuration).appendTo($li);
                    $("<span>").html(directionInstruction).appendTo($li);
                    $li.appendTo(directions);
                }
            }
        });

        // runs weather function as soon as direction function runs
    getCurrentWeather();
}

// function to get the current weather
function getCurrentWeather() {
    // defining 
    var userEnd = $("#inputDestination").val().trim();
    var endState = $("#inputDestination").val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userEnd + "," + endState + "&appid=" + APIKey;


    // Running AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (weatherData) {
            $(".weather-div").show();
            // converting temperatures from Kelvin to Fahrenheit 
            var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
            var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

            // adding icons to weather condition
            var imgIcon = $('<img>');
            imgIcon.attr('class', 'image');
            imgIcon.attr('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');

            // emptying divs before they're filled with new info
            currentWeather.empty();
            $('#icon').empty();

            // formatting current weather data and icons
            $('#icon').append(imgIcon)
            $('<h6>').text("Destination City: " + weatherData.name).appendTo(currentWeather)
            $('<h6>').text("Date: " + momentTime).appendTo(currentWeather)
            $('<h6>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather)
            $('<h6>').text("Feels Like: " + feelsLike).appendTo(currentWeather)
            $('<h6>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
            $('<h6>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather)

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
                    console.log(moreData);
                    $('<h5 id = ' + userEnd + '>').text("UV Index: " + moreData.value).appendTo(currentWeather);
                    if (moreData.value <= 2) {
                        $('#' + userEnd).addClass('green');
                    }
                    else if (moreData.value <= 5) {
                        $('#' + userEnd).addClass('yellow');
                    }
                    else if (moreData.value <= 7) {
                        $('#' + userEnd).addClass('orange');
                    }
                    else if (moreData.value <= 10) {
                        $('#' + userEnd).addClass('red');
                    }
                    else if (moreData.value > 10) {
                        $('#' + userEnd).addClass('purple');
                    }
                });
        });
};

// logic
$(document).ready(function () {
    // running directions function on click as well as emptying input values
    submitBtn.on("click", function (event) {
        event.preventDefault();
        getDirections();
        $("#inputStart").val("");
        $("#startState").val("");
        $("#inputDestination").val("");
        $("#endState").val("");
        $("#startAddress").val("")
        $("#destinationAddress").val("")
    });
});


