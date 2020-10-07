userTextForm = $('#userText');
userTextForm.on("submit", function() {
      var curCity = captureCurrentCity();
      cityCurrentWeather(curCity);
      locallyStoreData(curCity);
});
window.onload(localStorage.clear());

function captureCurrentCity() {
  event.preventDefault();
  var currentSearchedCity = $("#searchedCity").val();
  cityName = currentSearchedCity;
  return currentSearchedCity;
}

function getSetUvIndex(latitude, longitude){
  var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=f61cd5ab2e990136cdf830181c8dc668";
  $.ajax({
      url: queryURL,
      method: "GET"
  })
      .then(function(response) {
        $("#currentWeather").empty();
          $("#currentWeather").append(
          '<li>UV Index: <button id="uv" type="button">' + response.value + '</button></li>'
          );
          if (response.value < 4) {
              $("#uv").addClass("btn btn-success disabled");
          }
          else if (response.value > 4) {
              $("#uv").addClass("btn btn-warning disabled");
          }
          else if (response.value > 7) {
              $("#uv").addClass("btn btn-danger disabled");
          }
      });
}

function cityCurrentWeather(city){
  var key = "f61cd5ab2e990136cdf830181c8dc668";
  var city = city;
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;
  $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(response) {
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          retrieveOneCallData(lat,lon);
          getSetUvIndex(lat,lon);
      }
  });
};

function retrieveOneCallData(lat, lon){
  var key = "f61cd5ab2e990136cdf830181c8dc668";
  var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + key;
  $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      data: {
          units: "imperial",
      },
      success: function(response) {
          console.log(response);
          var currentTemp = response.current.temp;
          var dt = response.current.dt;
          var weirdDateFormat = new Date(dt*1000).toISOString();
          var date = moment(weirdDateFormat);
          var humidity = response.current.humidity;
          var currentIcon = "<img src='https://openweathermap.org/img/w/" +response.current.weather[0].icon + ".png'>"
          var windSpeed = response.current.wind_speed;
          
          // Displays current weather in the main card
          $("#currentTemp").empty();
          $("#currentTemp").append(currentTemp + '°F');
          $("#time-and-description").empty();
          $("#time-and-description").append( date.format('llll') + ' ' + response.current.weather[0].description);
          $("#humidityDisplay").empty();
          $("#humidityDisplay").append(' ' + humidity);
          $("#wind-display").empty();
          $("#wind-display").append(' Wind: ' + windSpeed + 'mph');
          $("#curentCityName").empty();
          $("#curentCityName").append(
              '<h2>' + cityName + currentIcon + '</h2>',
          );

          // FIVE FUTURE DAYS FORECAST ================
          $("#fiveDay").empty();
          for (let i = 1; i < 6; i++) {

              var dt = response.daily[i].dt;
              var weirdDateFormat = new Date(dt*1000).toISOString();
              var date = moment(weirdDateFormat);
              var humidity = response.daily[i].humidity;
              var currentIcon = "<img src='https://openweathermap.org/img/w/" +response.daily[i].weather[0].icon + ".png'>"
              var windSpeed = response.daily[i].wind_speed;
              var weatherDescription = response.daily[i].weather[0].description;
              var currentTemp = response.daily[i].temp.day;
    

              $("#fiveDay").append(
                  `<div class="card forecast-card" id="forecast-card`+i+`"></div>`
              )
              currentForecastCard = $("#forecast-card"+i);

              currentForecastCard.append(
                  '<div>' + date.format('llll') + '</div>',
                  '<li>Temperature: ' + currentTemp + '°F</li>',
                  '<li>Humidity: ' + humidity + '</li>',
                  '<li>Wind Speed: ' + windSpeed + 'MPH</li>',
                  '<li>'+ weatherDescription + currentIcon+'</li>'
              );
          };    
      }
  });
};


function locallyStoreData(data) {
    var citiesArray = JSON.parse(localStorage.getItem('previousCities')) || [];
    citiesArray.unshift(data);
    if (citiesArray.length > 10) {
        citiesArray.pop();
        console.log(citiesArray);
    }
    localStorage.setItem('previousCities', JSON.stringify(citiesArray));
    populatePreviousSearches();
};

function populatePreviousSearches(){
    $("#cities").empty();
    citiesArray = JSON.parse(localStorage.getItem('previousCities'));

    for (let i = 0; i < citiesArray.length; i++) {
        $("#cities").append(`
        <button type="button" class="btn previousSearchButton">` + citiesArray[i] + `</button>
        `)

    };
};

window.onload = function() {
    $("#cities").empty();
    populatePreviousSearches();
};

$(".previousSearchButton").on('click', function(){
    curCity = $(this).text();
    cityName = curCity;
    cityCurrentWeather(curCity);
    locallyStoreData(curCity);
});

84

$(document).on('click', '.previousSearchButton', function () {
    curCity = $(this).text();
    cityName = curCity;
    cityCurrentWeather(curCity);
    locallyStoreData(curCity);
});