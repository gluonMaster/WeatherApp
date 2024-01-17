function onPressButton(event) {
  event.preventDefault();
  let textField = document.querySelector("form .search-input");
  let city = textField.value;
  city = city.trim().toLowerCase();
  city = capitalise(city);
  let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  axios.get(apiUrl).then(apiDataGeo);
  htmlUpdateCity(city);
  textField.value = null;
  htmlUpdateDate();
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

function htmlUpdateDate() {
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
  let body = document.getElementById("global");

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
  }

  randomVideoBackground()

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  currentDayTime.innerHTML = `${days[day]} ${hours}:${minutes}`;
}

function apiDataGeo(response) {
  //console.log(response.data[0].lat);
  //console.log(response.data[0].lon);
  //console.log(response);
  try {
    let lat = response.data[0].lat;
    let lon = response.data[0].lon;
    let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlGeo).then(changeTemperature);
  } catch (err) {
    //console.log(`The error is: ${err.message}`);
    htmlUpdateCity("!Incorrect request!");
    let h1Component = document.getElementById("currentTemp");
    h1Component.innerHTML = `--`;
    //alert(`We have no any information about city you requested`);
    throw new Error("The search request is incorrect!");
  }
}

function apiDataCity(response) {
  //console.log(response);
  const weatherData={
    temperature: 0,
    humidity: 0,
    wind: 0,
    cloudy: 0,
    cityTime: 0,
    sunRise: 0,
    sunSet: 0,
    description: "",
  };
  weatherData.temperature = response.data.main.temp;
  weatherData.humidity = response.data.main.humidity;
  weatherData.wind = response.data.wind.speed;
  weatherData.cloudy = response.data.clouds.all;
  weatherData.cityTime = response.data.dt;
  weatherData.sunRise = response.data.sys.sunrise;
  weatherData.sunSet = response.data.sys.sunset;
  weatherData.description = response.data.weather[0].description;
  return weatherData;
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
    if (weatherData.cloudy<30) {
      weatherIcon.src = "src/images/icons/night_clear_sky.png";
    } else if (weatherData.cloudy>=30 && weatherData.cloudy<76) {
      weatherIcon.src = "src/images/icons/night_sky_clouds50.png";
    }
  }



  if (weatherData.cloudy>25 && weatherData.cloudy<51) {
    weatherIcon.src = "src/images/icons/sun50.png";
  } else if (weatherData.cloudy>=51 && weatherData.cloudy<76) {
    weatherIcon.src = "src/images/icons/sun25.png";
  } else if (weatherData.cloudy>=76 && weatherData.cloudy<85) {
    weatherIcon.src = "src/images/icons/clouds.png";
  } else if (weatherData.cloudy>=85) {
    weatherIcon.src = "src/images/icons/clouds_thick.png";
  }
}

const apiKey = "5201594abea9f3e38b70e65b11a80c24";
const units = "metric";
let reloadsCount=0;

window.onload = htmlUpdateDate();
window.onload = (()=> {
  let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=Paris&limit=5&appid=${apiKey}`;
  axios.get(apiUrl).then(apiDataGeo);
});

let citySearchForm = document.querySelector("#search-form");
citySearchForm.addEventListener("submit", onPressButton);
