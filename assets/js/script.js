//API Calls
var API01 = "https://api.openweathermap.org/data/2.5/weather?q=";
var API01Key = "&units=imperial&appid=13bb915a529e6e3d8aaaafecaadcbe28";
var API02 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var API02Key = "&units=imperial&exclude=minutely,hourly&appid=13bb915a529e6e3d8aaaafecaadcbe28";

var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search-button");
var nameEl = document.getElementById("city-name");
var currentTempEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindEl = document.getElementById("wind-speed");
var currentPicEl = document.getElementById("current-pic");
var currentUVEl = document.getElementById("UV-index");
var clearEl = document.getElementById("clear-history");
var historyEl = document.getElementById("history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
console.log(searchHistory);

// function that executes main function
var citySubmitHandler = function(event) {
    event.preventDefault();
    var cityName = inputEl.value.trim();
    if (cityName) {
        getCurrentWeather(cityName);
        inputEl.value = "";
    } else {
            alert("That City is not found. Please try again");
        }
    searchHistory.push(cityName);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    renderSearchHistory();
};
// function clears local storage and search history list
var clearSubmitHandler = function(event) {
    searchHistory = [];
    renderSearchHistory();
};
//Main funcition that retrieves weather information
var getCurrentWeather = function(cityName) {
    //First API Call
    fetch(API01 + cityName + API01Key).then(function(response) {
        response.json().then(function(data) {
            var weatherPic = data.weather[0].icon;
            nameEl.innerHTML = data.name + "  (" + moment().format('l')+")";   
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentTempEl.innerHTML = "Temperature: " + Math.floor(data.main.temp) + "&deg F";
            currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + Math.floor(data.wind.speed) + " MPH";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var API02L = lat + "&lon=" + lon; 
    // Second API Call        
    fetch(API02 + API02L + API02Key).then(function(response) {
        response.json().then(function(data) {
            var currentUVI = data.current.uvi;
            var UVIndex = document.createElement("span");
                if (currentUVI <3) {
                    UVIndex.setAttribute("class","badge badge-success");
                } else if (currentUVI >= 3 && currentUVI < 8) {
                    UVIndex.setAttribute("class","badge badge-warning");
                } else {
                    UVIndex.setAttribute("class","badge badge-danger");
                };
            UVIndex.innerHTML =  currentUVI;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex); 
            var forecastEls = document.querySelectorAll(".forecast");
            for(i=0; i<forecastEls.length;i++){
                forecastEls[i].innerHTML = "";
                var forecastDate = moment.unix(data.daily[i+1].dt).format("M/D/YYYY");
                var forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastDate;
                forecastEls[i].append(forecastDateEl);
                var forecastIcon = data.daily[i+1].weather[0].icon;
                var forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
                forecastEls[i].append(forecastWeatherEl);
                var forecastTemp = Math.floor(data.daily[i+1].temp.day);
                var forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + forecastTemp + "&#176 F";
                forecastEls[i].append(forecastTempEl);
                var forecastHumidity = data.daily[i+1].humidity;
                var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + forecastHumidity + "%";
                forecastEls[i].append(forecastHumidityEl);
                }//end of for statement
            })//end of second json
        })//end of second API Call
        });//end of first json
    });//end of firstAPI call
};//end of getCurrentWeather function

//function adds each search to the search history list
var renderSearchHistory = function() {
    historyEl.innerHTML = "";
    for (let i=0; i<searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
            getCurrentWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    getCurrentWeather(searchHistory[searchHistory.length - 1]);
}
//click handler that executes main script
searchEl.addEventListener("click", citySubmitHandler);
// click handler that clears search history
clearEl.addEventListener("click", clearSubmitHandler);
