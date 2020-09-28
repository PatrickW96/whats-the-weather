$(document).ready(function () {
    var cityHistoryArray = [];
    var APIkey = '889fa96c2ff3642885f0a0352803b7d4';

    // Submit button event function
    $('#submitBtn').on('click', function (event) {
        event.preventDefault();

        var searched = $('#citySearched').val().trim();
        cityHistoryArray.push(searched);

        displayHistory(); //Function used to display users searched history.
        $('#weatherContainer').remove();  //Removing the last city before appending the next.

        var currentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}&units=imperial`;

        $.ajax({
            url: currentWeatherQueryURL,
            method: "GET"
        }).then(function (response) {
            displayMainCard(response);

            var cityID = response.id;
            var futureForecastDiv = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
            var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIkey}&units=imperial`;

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response2) {

                for (var i = 0; i <= 39; i += 8) {
                    displayFiveDay(futureForecastDiv, response2, i);
                };
            });
        });

    });

    // When history div's are clicked 
    $(document).on('click' , '.city-searched' , function() {
        var city = $(this).text();
        var currentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;

        $.ajax({
            url: currentWeatherQueryURL,
            method: "GET"
        }).then(function (responses) {
            redisplayHistory(city , responses);
        
            var cityIDs = responses.id;
            var futureForecastDiv2 = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
            var forecastURL2 = `http://api.openweathermap.org/data/2.5/forecast?id=${cityIDs}&appid=${APIkey}&units=imperial`;

            $.ajax({
                url: forecastURL2,
                method: "GET"
            }).then(function (responses2) {

                for (var j = 0; j <= 39; j += 8) {
                    redisplayFiveDay(futureForecastDiv2, responses2, j);
                };
            });
        });
    });

// ======================================================================================================================================

    // FUNCTIONS
    function displayMainCard(apiData) {
        var weatherContainer = $(`<div id="weatherContainer" class="col-md-8 ml-md-4 mx-auto"></div>`);
        $('main').append(weatherContainer);

        var date = new Date(apiData.dt * 1000).toLocaleDateString();
        var currentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h1 id="cityName" ml-3 p-1>${apiData.name}<h1>` +
            `<h2 class="ml-4 p-1 pb-1">(${date}) <img src="http://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${apiData.main.temp.toFixed(1)} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong> ${apiData.main.humidity} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${apiData.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1"><strong>UV index:</strong>9.45</p>` +
            ` </div>`;

        $('#weatherContainer').append(currentCity);
        $('#weatherContainer').append($('<h5 id="forecasth5">5-Day Forecast</h5>'));

    };

    function displayFiveDay(futureForecastDiv, apiData, currentIndex) {

        futureForecastDiv.append(`<div id="forecastDiv" class="border col-md-2 mx-3 my-1">` +
            `<h6 id="fiveDays${currentIndex}"></h6>` +
            `<img src="http://openweathermap.org/img/wn/${apiData.list[currentIndex].weather[0].icon}@2x.png">` +
            `<p>Temp:${apiData.list[currentIndex].main.temp.toFixed(1)}&deg;F</p>` +
            `<p>Humidity: ${apiData.list[currentIndex].main.humidity}%</p>` +
            `</div>`);
        $('#weatherContainer').append(futureForecastDiv);

        $('#fiveDays0').text(new Date(apiData.list[7].dt * 1000).toLocaleDateString());
        $('#fiveDays8').text(new Date(apiData.list[15].dt * 1000).toLocaleDateString());
        $('#fiveDays16').text(new Date(apiData.list[23].dt * 1000).toLocaleDateString());
        $('#fiveDays24').text(new Date(apiData.list[30].dt * 1000).toLocaleDateString());
        $('#fiveDays32').text(new Date(apiData.list[39].dt * 1000).toLocaleDateString());
    };


    function displayHistory() {
        $('.search-history').empty();
        for (var i = 0; i < cityHistoryArray.length; i++) {
            var historyDiv = $(`<div class="border p-3 city-searched" data-name="${cityHistoryArray[i]}">${cityHistoryArray[i].toUpperCase()}</div>`);
            $('.search-history').append(historyDiv);
        }
    }

// ======================================================================================================================================
    
    // REDISPLAYING HISTORY WITH FUNCTIONS BELOW
    function redisplayHistory(city , apiData) {
        $('#weatherContainer').remove();  //Removing the last city before appending the next.

        var weatherContainer = $(`<div id="weatherContainer" class="col-md-8 ml-md-4 mx-auto"></div>`);
        $('main').append(weatherContainer);

        var date = new Date(apiData.dt * 1000).toLocaleDateString();
        var reCurrentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h1 id="cityName" ml-3 p-1>${city}<h1>` +
            `<h2 class="ml-4 p-1 pb-1">(${date}) <img src="http://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${apiData.main.temp.toFixed(1)} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong> ${apiData.main.humidity} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${apiData.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1"><strong>UV index:</strong>9.45</p>` +
            ` </div>`;

        $('#weatherContainer').append(reCurrentCity);
        $('#weatherContainer').append($('<h5 id="forecasth5">5-Day Forecast</h5>'));
    };

    function redisplayFiveDay(futureForecastDiv2, apiData, currentIndex) {
        futureForecastDiv2.append(`<div id="forecastDiv" class="border col-md-2 mx-3 my-1">` +
            `<h6 id="fiveDays${currentIndex}"></h6>` +
            `<img src="http://openweathermap.org/img/wn/${apiData.list[currentIndex].weather[0].icon}@2x.png">` +
            `<p>Temp:${apiData.list[currentIndex].main.temp.toFixed(1)}&deg;F</p>` +
            `<p>Humidity: ${apiData.list[currentIndex].main.humidity}%</p>` +
            `</div>`);
        $('#weatherContainer').append(futureForecastDiv2);

        $('#fiveDays0').text(new Date(apiData.list[7].dt * 1000).toLocaleDateString());
        $('#fiveDays8').text(new Date(apiData.list[15].dt * 1000).toLocaleDateString());
        $('#fiveDays16').text(new Date(apiData.list[23].dt * 1000).toLocaleDateString());
        $('#fiveDays24').text(new Date(apiData.list[30].dt * 1000).toLocaleDateString());
        $('#fiveDays32').text(new Date(apiData.list[39].dt * 1000).toLocaleDateString());

    }
});