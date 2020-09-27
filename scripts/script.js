$(document).ready(function () {
    
    $('#submitBtn').on('click', function (event) {
        event.preventDefault();
        // $('#weatherContainer').clear();  //Removing the last city before appending the next.


        var searched = $('#citySearched').val();
        var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
        var curentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}&units=imperial`;

        $.ajax({
            url: curentWeatherQueryURL,
            method: "GET"
        }).then(function (response) {
            displayMainCard(response);
// ======================================================================================================================================
            var cityID = response.id;
            var futureForecastDiv = $(`<div>`).attr({ class: 'row mx-auto', id: 'futureForecastDiv' });
            var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIkey}&units=imperial`;

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response2) {
                for (var i = 0; i <= 39; i += 8) {
                    displayFiveDay(futureForecastDiv, response2, i);
                }


            });
        });

    });

    function displayMainCard(apiData) {

        var date = new Date(apiData.dt * 1000).toLocaleDateString();
        var currentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h2 class="ml-4 p-1 pb-1">${apiData.name} (${date}) <img src="http://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${apiData.main.temp.toFixed(1)} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong>${apiData.main.humidity} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${apiData.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1"><strong>UV index:</strong>9.45</p>` +
            ` </div>`;

        $('#weatherContainer').append(currentCity);
        $('#weatherContainer').append($('<h5 id="forecasth5">5-Day Forecast</h5>'));

    }

    function displayFiveDay(futureForecastDiv, apiData, currentIndex) {

        futureForecastDiv.append(`<div id="forecastDiv" class="border col-md-2 mx-3 my-1">` +
            `<h6 id="fiveDays${currentIndex}"></h6>` +
            `<img src="http://openweathermap.org/img/wn/${apiData.list[currentIndex].weather[0].icon}@2x.png">` +
            `<p>Temp:${apiData.list[currentIndex].main.temp.toFixed(1)}&deg;F</p>` +
            `<p>Humidity: ${apiData.list[currentIndex].main.humidity}%</p>` +
            `</div>`);
        $('#weatherContainer').append(futureForecastDiv);

        $('#fiveDays0').text(new Date(apiData.list[0].dt * 1000).toLocaleDateString());
        $('#fiveDays8').text(new Date(apiData.list[8].dt * 1000).toLocaleDateString());
        $('#fiveDays16').text(new Date(apiData.list[16].dt * 1000).toLocaleDateString());
        $('#fiveDays24').text(new Date(apiData.list[24].dt * 1000).toLocaleDateString());
        $('#fiveDays32').text(new Date(apiData.list[32].dt * 1000).toLocaleDateString());
    };


});

