function geoCoordFromCityName(city){
    let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    axios.get(apiUrl).then(apiDataGeo);
}

function onPressButton(event) {
    event.preventDefault();
    let textField = document.querySelector("form .search-input");
    let city = textField.value;
    city = city.trim().toLowerCase();
    city = capitalise(city);
    geoCoordFromCityName(city);
    htmlUpdateCity(city);
    textField.value = null;
    htmlUpdateDate(city);
}

function capitalise(cityName) {
    let cityWords = cityName.split(" ");
    for (let i = 0; i < cityWords.length; i++) {
        cityWords[i] = cityWords[i][0].toUpperCase() + cityWords[i].substr(1);
    }
    cityName = cityWords.join(" ");
    return cityName;
}

function htmlUpdateCity(cityName) {
    let h1City = document.querySelector("div .current-city");
    h1City.innerHTML = cityName;
}

function randomVideoBackground(){
    let videoBackground = document.getElementById("video-background");
    let fileNamesArray=[
        "mist",
        "mist2",
        "snow1",
        "snow2",
        "sunshine",
        "shiny",
        "blitz",
        "strong_rain",
        "slight_rain",
        "cloudy_rain",
        "cloudy_thick",
        "light_clouds",
        "morning"
    ];
    let randomIndex=Math.round(Math.random()*12);
    let videoFileName=fileNamesArray[randomIndex]+".mp4";
    let videoHtml = `<source src="src/images/${videoFileName}" type="video/mp4" />`;

    videoBackground.innerHTML = videoHtml;
}

async function hrefSameCityNameOnclickData(lat, lon) { /* , old_lat, old_lon, i, cityName, country, state*/
    console.log(lat);
    console.log(lon);
    let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlGeo).then(changeTemperature);
    forecastApiRequest(lat, lon);
    /*apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${old_lat}&lon=${old_lon}&appid=${apiKey}&units=metric`;
    let weatherData = await axios.get(apiUrlGeo).then(apiDataCity);
    let quotedCityName=`"${cityName}"`;
    let quotedCountry=`"${country}"`;
    let quotedState=`"${state}"`;
    const rowSection = document.querySelector(`#row${i}`);
    rowSection.innerHTML=`<span class="table-content"><a class="sameCityNames-href" href="#" onClick="hrefSameCityNameOnclickData(${old_lat}, ${old_lon}, ${lat}, ${lon}, ${i}, ${quotedCityName}, ${quotedCountry}, ${quotedState})">${cityName}</a>️</span
                  ><span class="table-content">${country}️</span
                  ><span class="table-content">${state}️</span>
                  <span class="table-content">${Math.round(weatherData.temperature)}°C</span>`;*/
}

async function sameCityListGenerator(response) {
    let latSameCity=0;
    let lonSameCity=0;
    let SameCityHTML="";
    let weatherData = [];
    /*let cityName=`"${response.data[0].name}"`;
    console.log(cityName);
    let country=`"${response.data[0].country}"`;
    let state=`"${response.data[0].state}"`;*/
    const SameCitySection = document.querySelector("#tableCityRows");
    if (response==="Incorrect request!") {
        SameCityHTML=response;
    } else {
        let latMainCity = Math.round(response.data[0].lat);
        let lonMainCity = Math.round(response.data[0].lon);

        for (let i = 1; i < 5; i++) {
            latSameCity=Math.round(response.data[i].lat);
            lonSameCity=Math.round(response.data[i].lon);

            if (latMainCity !== latSameCity && lonMainCity !== lonSameCity) {
                let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${response.data[i].lat}&lon=${response.data[i].lon}&appid=${apiKey}&units=metric`;
                weatherData[i-1] = await axios.get(apiUrlGeo).then(apiDataCity);
                //console.log(weatherData[i-1]);

                SameCityHTML=SameCityHTML+`<div class="table-row" id="row${i}">
                  <span class="table-content"><a class="sameCityNames-href" href="#" onClick="hrefSameCityNameOnclickData(${weatherData[i-1].lat}, ${weatherData[i-1].lon}, ${response.data[0].lat}, ${response.data[0].lon}, ${i})">${response.data[i].name}</a>️</span
                  ><span class="table-content">${response.data[i].country}️</span
                  ><span class="table-content">${response.data[i].state}️</span>
                  <span class="table-content">${Math.round(weatherData[i-1].temperature)}°C</span>
                </div>
                `;
            }
        }

    }
    SameCitySection.innerHTML=SameCityHTML;
}

function forecastGenerator(cityName, days, day) {
    let dayForecast="";
    let forecastHTML="";
    const forecastSection = document.querySelector(".forecast");

    for (let i = 1; i < 7; i++) {
        day = day + 1;
        if (day>6) {
            day=day-7;
        }
        dayForecast=days[day].substring(0,3);
        forecastHTML=forecastHTML+`<div class="day-forecast">
                <div class="day-forecast-name">${dayForecast}</div>
                <div class="icon-wrapper" id="icon${i}">
                  <img src="src/images/icons/WeatherDontKnow.png" class="day-forecast-icon" alt="🌤">
                </div>
                <div class="day-forecast-temperature" id="tempDay${i}">
                  <span class="day-forecast-temp">--°</span>
                  <span class="day-forecast-temp-realFeel">--°</span>
                </div>
              </div>
                `;
    }
    forecastSection.innerHTML=forecastHTML;
    geoCoordFromCityName(cityName);
}

function forecastInserter(response) {
    //console.log(response);
    let idTemp="";
    let idIcon="";
    let icon="";

    let weatherData={
        cloudy: 0,
        description: "",
        rain: 0,
        snow: 0,
    };

    for (let i = 1; i < 7; i++) {
        weatherData.rain=0;
        weatherData.snow=0;
        idTemp=`#tempDay${i}`;
        let tempSection = document.querySelector(idTemp);
        tempSection.innerHTML=`<span class="day-forecast-temp">
                                ${Math.round(response.data.daily[i].temp.eve)}°
                           <span class="tooltip">Average temp</span>
                           </span>
                           <span class="day-forecast-temp-realFeel">
                                ${Math.round(response.data.daily[i].feels_like.eve)}°
                           <span class="tooltip">Real-feel temp</span>
                           </span>`;
        //console.log(`temperature in ${i}day ${response.data.daily[i].temp.eve}`);
        //console.log(`RealFeel temp in ${i}day ${response.data.daily[i].feels_like.eve}`)
        idIcon=`#icon${i}`;
        let iconSection = document.querySelector(idIcon);
        weatherData.cloudy=response.data.daily[i].clouds;

        if ("rain" in response.data.daily[i]) {
            weatherData.rain=response.data.daily[i].rain;
            //console.log(`rain is ${weatherData.rain}`);
        }
        if ("snow" in response.data.daily[i]) {
            weatherData.snow=response.data.daily[i].snow;
            //console.log(`Snow is ${weatherData.snow}`);
        }

        icon = dayWeatherIconSelection(weatherData);
        iconSection.innerHTML=`<img src="${icon}" class="day-forecast-icon" alt="weather icon">`;
        //console.log(`Clouds density in ${i}day ${response.data.daily[i].clouds}`)
    }
}

function htmlUpdateDate(cityName) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thirsay",
        "Friday",
        "Saturday",
    ];
    let now = new Date();
    let day = now.getDay();
    //let hours = 6;
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let currentDayTime = document.querySelector(
        ".current-weather #currentDate"
    );
    /*let body = document.getElementById("global");

    if (hours > 20 || hours < 5) {
      body.style[
        "background"
      ] = `url("src/images/night_sky.jpg") no-repeat center fixed`;
      body.style["background-size"] = `cover`;
    } else if ((hours > 5 && hours < 7) || (hours > 18 && hours < 20)) {
      body.style[
        "background"
      ] = `url("src/images/evening_sky.jpg") no-repeat center fixed`;
      body.style["background-size"] = `cover`;
    } else {
      body.style[
        "background"
      ] = `url("src/images/day_sky.jpg") no-repeat center fixed`;
      body.style["background-size"] = `cover`;
    }*/

    randomVideoBackground()

    if (hours < 10) {
        hours = `0${hours}`;
    }

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    currentDayTime.innerHTML = `${days[day]} ${hours}:${minutes}`;
    forecastGenerator(cityName, days, day)
}

function forecastApiRequest(lat, lon) {
    const forecastUrlApi=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&appid=${apiKey}&units=metric`;
    axios.get(forecastUrlApi).then(forecastInserter);
}

function apiDataGeo(response) {
    //console.log(response.data[0].lat);
    //console.log(response.data[0].lon);
    //console.log(response);
    try {
        let lat = response.data[0].lat;
        let lon = response.data[0].lon;
        let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        forecastApiRequest(lat, lon)
        axios.get(apiUrlGeo).then(changeTemperature);
        sameCityListGenerator(response);
    } catch (err) {
        //console.log(`The error is: ${err.message}`);
        htmlUpdateCity("!Incorrect request!");
        let h1Component = document.getElementById("currentTemp");
        h1Component.innerHTML = `--`;
        response="Incorrect request!";
        sameCityListGenerator(response);
        //alert(`We have no any information about city you requested`);
        throw new Error("The search request is incorrect!");
    }
}

function apiDataCity(response) {
    console.log(response);
    const weatherData={
        lat: 0,
        lon: 0,
        temperature: 0,
        humidity: 0,
        wind: 0,
        cloudy: 0,
        cityTime: 0,
        sunRise: 0,
        sunSet: 0,
        description: "",
        rain: 0,
        snow: 0,
    };
    weatherData.lat = response.data.coord.lat;
    weatherData.lon = response.data.coord.lon;
    weatherData.temperature = response.data.main.temp;
    weatherData.humidity = response.data.main.humidity;
    weatherData.wind = response.data.wind.speed;
    weatherData.cloudy = response.data.clouds.all;
    weatherData.cityTime = response.data.dt;
    weatherData.sunRise = response.data.sys.sunrise;
    weatherData.sunSet = response.data.sys.sunset;
    weatherData.description = response.data.weather[0].description;
    if ("rain" in response.data) {
        weatherData.rain=response.data.rain["1h"];
        //console.log(`rain is ${weatherData.rain}`);
    }
    if ("snow" in response.data) {
        weatherData.snow=response.data.snow["1h"];
        //console.log(`Snow is ${weatherData.snow}`);
    }
    return weatherData;
}

function dayWeatherIconSelection(weatherData) {
    let icon="";

    if (weatherData.rain>0 && weatherData.snow>0){
        //console.log("rain and snow positive");
        if (weatherData.temperature>0){
            if (weatherData.rain<4) {
                icon = "src/images/icons/clouds_thick_rain.png";
            } else {icon = "src/images/icons/clouds_thick_rain_heavy.png";}
        } else {icon = "src/images/icons/snow.png";}
    } else if (weatherData.rain>0) {
        //console.log("only rain positive");
        if (weatherData.rain<4) {
            icon = "src/images/icons/clouds_thick_rain.png";
        } else {icon = "src/images/icons/clouds_thick_rain_heavy.png";}
    } else if (weatherData.snow>0) {
        //console.log("only snow positive");
        icon = "src/images/icons/snow.png";
    } else {
        //console.log("rain and snow null");
        if (weatherData.cloudy>25 && weatherData.cloudy<51) {
            icon = "src/images/icons/sun50.png";
        } else if (weatherData.cloudy>=51 && weatherData.cloudy<76) {
            icon = "src/images/icons/sun25.png";
        } else if (weatherData.cloudy>=76 && weatherData.cloudy<85) {
            icon = "src/images/icons/clouds.png";
        } else if (weatherData.cloudy>=85) {
            icon = "src/images/icons/clouds_thick.png";
        } else {
            icon = "src/images/icons/sun100.png";
        }
    }

    return icon;
}

function nightWeatherIconSelection(weatherData) {
    let icon="";

    if (weatherData.rain>0 && weatherData.snow>0){
        if (weatherData.temperature>0){
            if (weatherData.rain<4) {
                icon = "src/images/icons/clouds_thick_rain.png";
            } else {icon = "src/images/icons/clouds_thick_rain_heavy.png";}
        } else {icon = "src/images/icons/night_snow.png";}
    } else if (weatherData.rain>0) {
        if (weatherData.rain<4) {
            icon = "src/images/icons/clouds_thick_rain.png";
        } else {icon = "src/images/icons/clouds_thick_rain_heavy.png";}
    } else if (weatherData.snow>0) {
        icon = "src/images/icons/night_snow.png";
    } else {
        if (weatherData.cloudy<30) {
            icon = "src/images/icons/night_clear_sky.png";
        } else if (weatherData.cloudy>=30 && weatherData.cloudy<76) {
            icon = "src/images/icons/night_sky_clouds50.png";
        }
    }

    return icon;
}


function changeTemperature(response) {
    const weatherData = apiDataCity(response);
    //console.log(weatherData.temperature);
    //console.log(weatherData.humidity);
    //console.log(weatherData.wind);
    //console.log(weatherData.cloudy);
    //console.log(weatherData.cityTime);
    //console.log(weatherData.sunRise);
    //console.log(weatherData.sunSet);
    //console.log(weatherData.description);
    //console.log(Math.round(temperature));
    let h1Component = document.getElementById("currentTemp");
    h1Component.innerHTML = `${Math.round(weatherData.temperature)}`;

    const weatherDescription= document.getElementById("weatherDescription");
    weatherDescription.innerHTML = `, ${weatherData.description} <br />
                Humidity: <strong>${weatherData.humidity}%</strong>, Wind: <strong>${weatherData.wind}km/h</strong>`;

    const weatherIcon= document.querySelector(".current-temperature-icon");
    if (weatherData.cityTime>weatherData.sunSet || weatherData.cityTime<weatherData.sunRise) {
        weatherIcon.src = nightWeatherIconSelection(weatherData);
    } else {
        weatherIcon.src = dayWeatherIconSelection(weatherData);
    }
    if (weatherData.cloudy>=85) {
        weatherIcon.src = dayWeatherIconSelection(weatherData);
    }
}

const apiKey = "5201594abea9f3e38b70e65b11a80c24";
const units = "metric";
let reloadsCount=0;

window.onload = htmlUpdateDate("Paris");

let citySearchForm = document.querySelector("#search-form");
citySearchForm.addEventListener("submit", onPressButton);
