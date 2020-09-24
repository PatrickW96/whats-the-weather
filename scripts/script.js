$(document).ready(function() { 
    $('#submitBtn').on('click' , function(event) {
        event.preventDefault();
        $('#currentCity').remove();

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
            `<h3 class="ml-4 p-1 pb-2">${result.name} (${date}) <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png"></h3>` +
            `<p class="ml-4 p-1">${result.main.temp} &deg;F</p>` +
            `<p class="ml-4 p-1">${result.main.humidity} %</p>` +
            `<p class="ml-4 p-1">${result.wind.speed} MPH</p>` +
            `<p class="ml-4 p-1">UV index: 9.46</p>` +
           ` </div>`;

           $('#weatherContainer').append(currentCity);
            console.log(date);
            console.log(searched);
            console.log(result);
        });    
    });
});


// $('#submitBtn').on('click' , function() { 
    // var searched = $('#citySearched').val();

    // var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
    // var curentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}`;

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