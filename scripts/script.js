$(document).ready(function () {

    var cityHistoryArray = [];   // Defininig array for search history
    var APIkey = '889fa96c2ff3642885f0a0352803b7d4';

    // Submit button event function
    $('#submitBtn').on('click', function (event) {
        if($(`#citySearched`).val() === "") {
            return false;
        }
        event.preventDefault();

        var searched = $('#citySearched').val().trim(); //Taking users input and adding it to API url
        cityHistoryArray.push(searched); //Pushing user input to cityHistoryArray

        displayHistory(); //Function used to display users searched history.
        $('#weatherContainer').remove();  //Removing the last city before appending the next.

        var currentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}&units=imperial`;
        // Current day ajax call
        $.ajax({
            url: currentWeatherQueryURL,
            method: "GET"
        }).then(function (response) {
            displayMainCard(response);

            // UVI ajax call
            uviURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`;
            $.ajax({
                url : uviURL,
                method : "GET"
            }).then(function(result) {
                $(`#currentCity`).append(`<p class="ml-4 p-1"><strong>UV Index:</strong> <span class="uvi p-2">${result.value}</span></p>`);
                if(result.value <= 3) {
                    $(`.uvi`).css({'background-color':'green' , 'color':'black'});
                } 
                if (result.value > 3 && result.value < 6) {
                    $(`.uvi`).css({'background-color':'yellow' , 'color':'black'});
                } else {
                    $(`.uvi`).css({'background-color':'red' , 'color':'black'});
                }
            });    

            var cityID = response.id;
            var futureForecastDiv = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
            var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIkey}&units=imperial`;

            // 5 day forecast ajax call
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response2) {

                for (var i = 0; i <= 39; i += 8) { //Loop for iterating through forecast and finding next 5 dates 
                    displayFiveDay(futureForecastDiv, response2, i);
                };
            });
        });

    });

    // HISTORY DIV CLICK EVENT
    $(document).on('click' , '.city-searched' , function() {
        var city = $(this).text();
        var currentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
        // Making both ajax calls again for redisplay functions 
        $.ajax({
            url: currentWeatherQueryURL,
            method: "GET"
        }).then(function (responses) {
            redisplayHistory(city , responses);

            uviURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${responses.coord.lat}&lon=${responses.coord.lon}&appid=${APIkey}`;
            $.ajax({
                url : uviURL,
                method : "GET"
            }).then(function(result) {
                $(`#currentCity`).append(`<p class="ml-4 p-1"><strong>UV Index:</strong> <span class="uvi p-2">${result.value}</span></p>`);
                if(result.value <= 3) {
                    $(`.uvi`).css({'background-color':'green' , 'color':'black'});
                } 
                if (result.value > 3 && result.value < 6) {
                    $(`.uvi`).css({'background-color':'yellow' , 'color':'black'});
                }
                if (result.value > 6) {
                    $(`.uvi`).css({'background-color':'red' , 'color':'black'});
                }
            });
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
                `<h1 id="cityName" ml-3 p-1>${apiData.name.toUpperCase()}<h1>` +
                `<h2 class="ml-4 p-1 pb-1">(${date}) <img src="http://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png"></h2>` +
                `<p class="ml-4"><strong>Temperature:</strong> ${apiData.main.temp.toFixed(1)} &deg;F</p>` +
                `<p class="ml-4 p-1"><strong>Humidity:</strong> ${apiData.main.humidity} %</p>` +
                `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${apiData.wind.speed} MPH</p>` +
                `</div>`;

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
                var historyDiv = $(`<div class="border p-3 city-searched city${i}">${cityHistoryArray[i].toUpperCase()}<button id="clearBtn"><i class="fas fa-trash"></i></button></div>`);
                $('.search-history').append(historyDiv);
                setStorage(i);
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
                `</div>`;

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
        };

        function setStorage(index) {
            localStorage.setItem(`history${index}` , cityHistoryArray[index]);
        };    
});