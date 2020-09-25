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
            var result = response;
            var date = new Date(result.dt * 1000).toLocaleDateString();
            var currentCity = `<div id="currentCity" class="border my-3 py-3">` +
            `<h2 class="ml-4 p-1 pb-1">${result.name} (${date}) <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png"></h2>` +
            `<p class="ml-4"><strong>Temperature:</strong> ${result.main.temp.toFixed(1)} &deg;F</p>` +
            `<p class="ml-4 p-1"><strong>Humidity:</strong>${result.main.humidity} %</p>` +
            `<p class="ml-4 p-1"><strong>Wind Speed:</strong> ${result.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1"><strong>UV index:</strong>9.45</p>` +
           ` </div>`;

           $('#weatherContainer').append(currentCity);
           $('#weatherContainer').append($('<h5>5-Day Forecast</h5>'));
// ======================================================================================================================================
           var cityID = result.id;
           var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIkey}&units=imperial`;

           $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function(response2) {
                var result2 = response2;
                
                for (var j = 0; j < 40; j + 5) {
                    console.log("hey")
                }

                for (var i = 0; i < 5; i++) {
                    var forecastDiv = 
                        `<div id="forecastDiv" class="border col-sm-2 mr-3">` +
                        `<h6>${date2}</h6>` +
                        `<img src="http://openweathermap.org/img/wn/${result2.list[i].weather[0].icon}@2x.png">` +
                        `<p>Temp:${result2.list[i].main.temp.toFixed(1)}&deg;F</p>` +
                        `<p>Humidity: ${result2.list[i].main.humidity}%</p>` +
                        `</div>`;
                    $('#weatherContainer').append(forecastDiv);
                    }            
            })
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