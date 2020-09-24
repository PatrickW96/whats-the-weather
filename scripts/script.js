$(document).ready(function() { 
    $('#submitBtn').on('click' , function(event) {
        event.preventDefault();

        var searched = $('#citySearched').val();

        var APIkey = '889fa96c2ff3642885f0a0352803b7d4';
        var curentWeatherQueryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${APIkey}`;
    
        $.ajax({
            url: curentWeatherQueryURL,
            method: "GET"
        }).then(function(response) {
            var result = response;

            console.log(searched);
            console.log(result.dt);
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