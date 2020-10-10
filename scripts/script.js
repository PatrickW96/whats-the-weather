$(document).ready(function () {
    displayCardOnLoad();
    nullDetector();

    var futureForecastContainer = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
    var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
    var cityHistoryArray = [];   // Defininig array for search history


    for (var m = 0; m <= 39; m += 8) {
        forecastOnload(m);
    };


// Submit button event function
    $('#submitBtn').on('click', function (event) {
        clicked = true;
        inputHelper();
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
            mainCardStorage(response);

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
                uviStorage(result);
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
                    forecastStorage(response2 , i);
                };
            });
        });
    });
// HISTORY DIV CLICK EVENT- RECALLING AJAX
    $(document).on('click' , '.city-searched' , function() {
        var city = $(this).text();
        var currentWeatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
// RECALLING CURRENT 
        $.ajax({
            url: currentWeatherQueryURL,
            method: "GET"
        }).then(function (responses) {
            redisplayHistory(city , responses);
// RECALLING UVI 
            uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${responses.coord.lat}&lon=${responses.coord.lon}&appid=${APIkey}`;
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
// RECALLING 5 DAY 
            var cityIDs = responses.id;
            var futureForecastDiv2 = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
            var forecastURL2 = `https://api.openweathermap.org/data/2.5/forecast?id=${cityIDs}&appid=${APIkey}&units=imperial`;

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

// FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS  FUNCTIONS
    function displayCardOnLoad() {
        var weatherContainer = $(`<div id="weatherContainer" class="col-md-8 ml-md-4 mx-auto"></div>`);
        $('main').append(weatherContainer);

        var currentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h1 id="cityName" ml-3 p-1>${localStorage.getItem('city')}<h1>` +
            `<h2 class="ml-4 p-1 pb-1">(${localStorage.getItem('date')}) <img src="http://openweathermap.org/img/wn/${localStorage.getItem('imgSrc')}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${localStorage.getItem('temp')} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong> ${localStorage.getItem('humidity')} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${localStorage.getItem('windSpeed')} MPH</p>` +
            `</div>`;

        $('#weatherContainer').append(currentCity);
        $('#weatherContainer').append($('<h5 id="forecasth5">5-Day Forecast</h5>'));
        $(`#currentCity`).append(`<p class="ml-4 p-1"><strong>UV Index:</strong> <span class="uvi p-2">${localStorage.getItem('uvIndex')}</span></p>`);
    };

    function forecastOnload(index) {
        futureForecastContainer.append(`<div id="forecastDiv" class="border col-md-2 mx-3 my-1">` +
            `<h6 id="fiveDays${index}"></h6>` +
            `<img src="http://openweathermap.org/img/wn/${localStorage.getItem('img')}@2x.png">` +
            `<p>Temp:${localStorage.getItem('temperature')}&deg;F</p>` +
            `<p>Humidity: ${localStorage.getItem('humid')}%</p>` +
            `</div>`);
        $('#weatherContainer').append(futureForecastContainer);

        $('#fiveDays0').text(localStorage.getItem(`date0`));
        $('#fiveDays8').text(localStorage.getItem(`date8`));
        $('#fiveDays16').text(localStorage.getItem(`date16`));
        $('#fiveDays24').text(localStorage.getItem(`date24`));
        $('#fiveDays32').text(localStorage.getItem(`date32`));
    };

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
        for (var k = 0; k < cityHistoryArray.length; k++) {
            var historyDiv = $(`<div class="border p-3 city-searched city${k}">${cityHistoryArray[k].toUpperCase()}<button id="clearBtn"><i class="fas fa-trash"></i></button></div>`);
            $('.search-history').append(historyDiv);
            historyStorage(k);
        };
    };
    
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
        $('#fiveDays24').text(new Date(apiData.list[31].dt * 1000).toLocaleDateString());
        $('#fiveDays32').text(new Date(apiData.list[39].dt * 1000).toLocaleDateString());
    };

    function inputHelper() {
        if($(`#citySearched`).val() === "") {
    return false;
        };    
    };

    function historyStorage(index) {
        localStorage.setItem(`history${index}` , cityHistoryArray[index]);
    };

    function mainCardStorage(apiData) {
        var date = new Date(apiData.dt * 1000).toLocaleDateString();

        localStorage.setItem('city' , apiData.name);
        localStorage.setItem('date' , date);
        localStorage.setItem('imgSrc' , apiData.weather[0].icon);
        localStorage.setItem('temp' , apiData.main.temp.toFixed(1));
        localStorage.setItem('humidity' , apiData.main.humidity);
        localStorage.setItem('windSpeed' , apiData.wind.speed);
    };

    function uviStorage(apiData) {
        localStorage.setItem('uvIndex' , apiData.value);
    };

    function forecastStorage(apiData, index) {
        localStorage.setItem(`date0` , new Date (apiData.list[7].dt * 1000).toLocaleDateString());
        localStorage.setItem(`date8` , new Date (apiData.list[15].dt * 1000).toLocaleDateString());
        localStorage.setItem(`date16` , new Date (apiData.list[23].dt * 1000).toLocaleDateString());
        localStorage.setItem(`date24` , new Date (apiData.list[31].dt * 1000).toLocaleDateString());
        localStorage.setItem(`date32` , new Date (apiData.list[39].dt * 1000).toLocaleDateString());
        localStorage.setItem(`img` , apiData.list[index].weather[0].icon);
        localStorage.setItem(`temperature` , apiData.list[index].main.temp.toFixed(1));
        localStorage.setItem(`humid` , apiData.list[index].main.humidity);
    };

    function nullDetector() {
        if($('#cityName').text() === "null") {
            $('#weatherContainer').addClass('hide');
        } else {
            return;
        };    
    };
});