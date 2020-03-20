var userStart = $("#inputStart").val().trim()
var userEnd = $("#inputDestination").val().trim()
var submitBtn = $("#submitBtn")
// taste dive api information
var apiKey1 = "AIzaSyDgOE3QM2wQZZgOrdOyhBuX_GF-bgZGhU4"
var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + userStart + "&destination=" + userEnd + "&key=" + apiKey1
// weather variables
//moment
var momentTime = moment().format("MMMM Do YYYY");
//variables
var APIKey = "e885fd3db621744dfef49f4c1e174dc6";


function getDirections() {
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    
    .then(function(response){
        console.log(response);
    });
    getCurrentWeather();
}

// function to get the current weather
function getCurrentWeather() {
    var cityInput = $('#cityInput').val().trim();
    console.log(cityInput);

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;

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




$(document).ready(function(){

submitBtn.on("click", function(event){
    event.preventDefault();
    getDirections();
    console.log(userStart);
    console.log(userEnd);
    
});


});


