$(document).ready(function() { 

    $('#submitBtn').on('click' , function(event) {
        event.preventDefault();
        $('#currentCity').remove();  //Removing the last city before appending the next.

        var searched = $('#citySearched').val();
        var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
        var curentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}&units=imperial`;
    
        $.ajax({
            url: curentWeatherQueryURL,
            method: "GET"
        }).then(function(response) {
            var date = new Date(response.dt * 1000).toLocaleDateString();
            var currentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h2 class="ml-4 p-1 pb-1">${response.name} (${date}) <img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${response.main.temp.toFixed(1)} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong>${response.main.humidity} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${response.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1"><strong>UV index:</strong>9.45</p>` +
           ` </div>`;

           $('#weatherContainer').append(currentCity);
           $('#weatherContainer').append($('<h5 id="forecasth5">5-Day Forecast</h5>'));
// ======================================================================================================================================
           var cityID = response.id;
           var futureForecastDiv = $(`<div>`).attr({class:'row mx-auto', id:'futureForecastDiv'});
           var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIkey}&units=imperial`;

           $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function(response2) {    
                for (var i = 0; i <= 39; i+=8) {
                    futureForecastDiv.append(`<div id="forecastDiv" class="border col-md-2 mx-3 my-1">` +
                    `<h6 id="fiveDays${i}"></h6>` +
                    `<img src="http://openweathermap.org/img/wn/${response2.list[i].weather[0].icon}@2x.png">` +
                    `<p>Temp:${response2.list[i].main.temp.toFixed(1)}&deg;F</p>` +
                    `<p>Humidity: ${response2.list[i].main.humidity}%</p>` +
                    `</div>`);
                    $('#weatherContainer').append(futureForecastDiv);

                    $('#fiveDays0').text(new Date(response2.list[0].dt * 1000).toLocaleDateString());
                    $('#fiveDays8').text(new Date(response2.list[8].dt * 1000).toLocaleDateString());
                    $('#fiveDays16').text(new Date(response2.list[16].dt * 1000).toLocaleDateString());
                    $('#fiveDays24').text(new Date(response2.list[24].dt * 1000).toLocaleDateString());
                    $('#fiveDays32').text(new Date(response2.list[32].dt * 1000).toLocaleDateString());
                    };  
            });
        });    
    });
});



// function fiveDayAPI() {
//     var searchedCity = $('#citySearched').val();
//     var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
//     var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${APIkey}`;

//     $.ajax({
//         url: forecastURL,
//         method: "GET"
//     }).then(function(response) {
//         var result = response;
//         for (var i = 0; i < 5; i++) { 
//             var date = new Date(result.dt * 1000).toLocaleDateString();
//             var forecastDiv = 
//                 `<div id="forecastDiv" class="border col-md-2 mr-3">` +
//                 ` <h6>${date}</h6>` +
//                 ` <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png">` +
//                 `<p>${result.list[i].main.temp}</p>` +
//                 `<p>${result.list[i].main.humidity}</p>` +
//                 `</div>`;
//             $('#weatherContainer').append(forecastDiv);
//         }
//         console.log(result)
//         console.log(forecastURL)
        
//     })

    // var forecastDiv = 
    //     `<div id="forecastDiv" class="border col-md-2 mr-3">` +
    //        ` <h6>Date</h6>` +
    //        ` <p>icon</p>` +
    //         `<p>Temp</p>` +
    //         `<p>Humidity</p>` +
    //     `</div>`;

    // $.ajax ({
    //     url: forecastURL,
    //     method: "GET"
    // }).then(function(response) {
    //     var result = response;
    //     var date = new Date(result.dt * 1000).toLocaleDateString();

    // })
// }

    // $.ajax({
    //     url: curentWeatherQueryURL,
    //     method: "GET"
    // }).then(function(response) {
    //     var result = response;
    //     console.log(response);
    //     console.log(searched);
    //     console.log(result);
    // });
// });



// api.openweathermap.org/data/2.5/uvi/forecast?lat=37.75&lon=-122.37