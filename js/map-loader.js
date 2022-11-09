"use strict";

mapboxgl.accessToken = mapboxToken;

let mapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-98.4916, 29.4252], // starting position [lng, lat]
    zoom: 10, // starting zoom
}

let map = new mapboxgl.Map(mapOptions);

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [-98.4916, 29.4252], // starting position [lng, lat]
        zoom: 10, // starting zoom
    })
);

let marker = new mapboxgl.Marker()
    .setLngLat([-98.4861, 29.4260])
    .addTo(map)
    .setDraggable(true);

function onDragEnd() {
    var lngLat = marker.getLngLat();
    fiveDayForecast(marker.getLngLat());
    console.log(marker.getLngLat());
}

marker.on('dragend', onDragEnd);

$.get("https://api.openweathermap.org/data/2.5/onecall", {
    APPID: OPEN_WEATHER_APPID,
    lat: 29.423017,
    lon: -98.48527,
    units: "imperial",
    exclude: "minutely,hourly,alerts"
}).done(function (data) {
    console.log(data);
});

function fiveDayForecast(lngLat) {
    $.get("https://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_APPID,
        lat: lngLat.lat,
        lon: lngLat.lng,
        units: "imperial",
        exclude: "minutely,hourly,alerts"
    }).done(function (data) {
        console.log(data);
        buildWeather(data);
    });
}

function buildWeather(cards) {
    let postHTML = ``;

    cards.daily.forEach(function (card) {
        var newDate = new Date();

        postHTML += `     
                    <div class="container-fluid mt-3 mb-3" id="weather-cards">
                        <div class="row justify-content-center row-cols-sm-2 row-cols-md-5 row-cols-lg-5 row-cols-xl-5">
                            <div class="col-mt-5">
                                <div class="card text-center card-weather">
                                    <div class="card-header">${newDate.toLocaleString()}</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Day: ${card.temp.day}&#176; F</h5>
                                        <h5 class="card-title">Night: ${card.temp.night}&#176; F</h5>
                                        <p class="card-text">Humidity: ${card.humidity}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
    });
    $('#weather-cards').html(postHTML);
}

function updateWeather() {
    getRequest.done(function (data) {
        console.log(data);
        buildWeather(data);
    });
    getRequest.fail(function (error) {
        console.log(error);
    });
}

updateWeather();