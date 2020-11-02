setInterval(function () {
  let date = new Date();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  } else {
    hours = hours + "";
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  } else {
    minutes = minutes + ``;
  }
  let formatTime = `${hours}:${minutes}`;

  document.querySelector("#clock").innerHTML = formatTime;
}, 10000);

function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayName = days[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthName = months[date.getMonth()];

  let day = date.getDate();

  let currentDate = `${dayName}, ${day} ${monthName} `;

  return currentDate;
}

let now = new Date();

function hourMin(timestamp) {
  let currentTime = new Date(timestamp);
  let hours = currentTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  } else {
    hours = hours + "";
  }
  let min = currentTime.getMinutes();

  if (min < 10) {
    min = `0${min}`;
  } else {
    min = min + ``;
  }
  return `${hours} : ${min}`;
}
function sunriseTime(timestamp) {
  return `${hourMin(timestamp)}`;
}
function sunsetTime(timestamp) {
  return `${hourMin(timestamp)}`;
}
function showWeather(response) {
  document.querySelector("#current-Date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document.querySelector("#time-now").innerHTML = hourMin(
    response.data.dt * 1000
  );
  document.querySelector("#city-Name").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#current-Temp").innerHTML = Math.round(
    celsiusTemperature
  );
  highTemp = response.data.main.temp_max;
  document.querySelector("#high-Temp").innerHTML = Math.round(highTemp);
  lowTemp = response.data.main.temp_min;
  document.querySelector("#lowTemp").innerHTML = Math.round(lowTemp);
  document.querySelector("#humid").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind-Speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  let direction = document.querySelector("#wind-Direction");
  direction.innerHTML = cardinalPoint(response.data.wind.deg);

  document.querySelector("#sunrise").innerHTML = hourMin(
    response.data.sys.sunrise * 1000
  );
  document.querySelector("#sunset").innerHTML = hourMin(
    response.data.sys.sunset * 1000
  );
  let skyCover = document.querySelector("#sky-Cover");
  skyCover.innerHTML = response.data.weather[0].description;
}

function cardinalPoint(response) {
  let cardinalPoint = response;
  if (cardinalPoint > 0 && cardinalPoint <= 45) {
    cardinalPoint = "NNE";
  } else if (cardinalPoint > 45 && cardinalPoint <= 90) {
    cardinalPoint = "ENE";
  } else if (cardinalPoint > 90 && cardinalPoint <= 135) {
    cardinalPoint = "ESE";
  } else if (cardinalPoint > 135 && cardinalPoint <= 180) {
    cardinalPoint = "SSE";
  } else if (cardinalPoint > 180 && cardinalPoint <= 225) {
    cardinalPoint = "SSW";
  } else if (cardinalPoint > 225 && cardinalPoint <= 270) {
    cardinalPoint = "WSW";
  } else if (cardinalPoint > 270 && cardinalPoint <= 360) {
    cardinalPoint = "NNW";
  }
  return cardinalPoint;
}

function searchCity(city) {
  let key = "99ea6d6482e70fa93bc42bf12b70793f";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let unitsM = "metric";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${key}&units=${unitsM}`;
  axios.get(apiUrl).then(showWeather);
  axios.get(apiUrl).then(changeSky);
  let input = document.querySelector("#search-Input");
  input.value = "";
  let newApiEndPoint = "https://api.openweathermap.org/data/2.5/forecast";
  apiUrl = `${newApiEndPoint}?q=${city}&appid=${key}&units=${unitsM}`;
  axios.get(apiUrl).then(displayCurrentForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-Input").value;
  searchCity(city);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "99ea6d6482e70fa93bc42bf12b70793f";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let unitsM = "metric";
  let currentTemp = `${apiUrl}?lat=${lat}&lon=${long}&appid=${apiKey}&units=${unitsM}`;
  axios.get(currentTemp).then(showWeather);
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=${unitsM}&exclude=minutely&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeeklyForecast);
}
function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentPlace = document.querySelector("#current-Location");
currentPlace.addEventListener("click", currentLocation);

let searchForm = document.querySelector("#cityForm");
searchForm.addEventListener("submit", handleSubmit);

function convertToFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-Temp");
  let tempF = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(tempF);
  let hightempElement = document.querySelector("#high-Temp");
  let hightempF = (highTemp * 9) / 5 + 32;
  hightempElement.innerHTML = Math.round(hightempF);
  let lowtempElement = document.querySelector("#lowTemp");
  lowtempF = (lowTemp * 9) / 5 + 32;
  lowtempElement.innerHTML = Math.round(lowtempF);
  let forecastMax = document.querySelectorAll(".forecast-TempMax");
  forecastMax.forEach(function (item) {
    console.log(item.innerHTML);
    let currentTemp = item.innerHTML;
    item.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });
  let forecastMin = document.querySelectorAll(".forecast-TempMin");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  celsiusLink.addEventListener("click", convertToCelsius);
  fahrenheitLink.removeEventListener("click", convertToFahrenheit);
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-Temp");
  tempElement.innerHTML = Math.round(celsiusTemperature);
  let hightempElement = document.querySelector("#high-Temp");
  hightempElement.innerHTML = Math.round(highTemp);
  let lowtempElement = document.querySelector("#lowTemp");
  lowtempElement.innerHTML = Math.round(lowTemp);
  let forecastMax = document.querySelectorAll(".forecast-TempMax");
  forecastMax.forEach(function (item) {
    console.log(item.innerHTML);
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp - 32) * 5 + 9);
  });
  let forecastMin = document.querySelectorAll(".forecast-TempMin");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp - 32) * 5 + 9);
  });
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
}
let celsiusTemperature = null;
let highTemp = null;
let lowTemp = null;
let forecastMax = null;
let forecastMin = null;

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertToCelsius);

// images not working??//
function changeSky(response) {
  let skyImage = document.querySelector("#weatherSpace img");
  let value = response.data.weather[0].main;
  console.log(value);
  if (value === "Rain" || value === "Drizzle") {
    skyImage.setAttribute("src", "images/rain.png");
    skyImage.setAttribute("alt", response.data.weather[0].description);
  } else if (value === "Thunderstorm") {
    skyImage.setAttribute("src", "images/storm.png");
  } else if (value === "Snow") {
    skyImage.setAttribute("src", "images/snow.png");
  } else if (value === "Clear") {
    skyImage.setAttribute("src", "images/sky and grass.png");
  } else if (value === "Clouds") {
    skyImage.setAttribute("src", "images/cloud.png");
  } else {
    skyImage.setAttribute("src", "images/sun.png");
  }
}

// fiveDayForecast();
function displayWeeklyForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = null;
  forecastElement.innerHTML = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
  <div class="col-2">
    <h6><small>
    ${formatDate(forecast.dt * 1000)}
    </small></h6>
    <img src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png" alt="https://openweathermap.org/img/wn/${
      forecast.weather[0].description
    }"/>
    <br />
   <strong><span class="forecast-TempMax">
      ${Math.round(
        forecast.temp.max
      )} </span>°</strong> / <span class="forecast-TempMin"> ${Math.round(
      forecast.temp.min
    )}
    </span>°
    <br />
  </div>`;
  }
}
function displayCurrentForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
  <div class="col-2">
    <h6>
    ${hourMin(forecast.dt * 1000)}
    </h6>
    <img src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png" alt="icon"/>
    <br />
    <strong><span class="forecast-TempMax">
      ${Math.round(
        forecast.main.temp_max
      )}</span>°</strong> /  <span class="forecast-TempMin"> ${Math.round(
      forecast.main.temp_min
    )}
    </span>°
    <br />
  </div>`;
  }
}
var today = new Date().getHours();
if (today >= 0 && today <= 5) {
  document.body.style.backgroundImage =
    "linear-gradient(to top, #000000 0%, #080742 100%)";
} else if (today >= 6 && today <= 11) {
  document.body.style.backgroundImage =
    "linear-gradient(to top,  #080742 0%, #3533a1 100%)";
} else if (today >= 12 && today <= 17) {
  document.body.style.backgroundImage =
    "linear-gradient(to top,  #a06c0c 0%, #c7a464 100%)";
} else if (today >= 18 && today <= 23) {
  document.body.style.backgroundImage =
    "linear-gradient(120deg, #080742 0%, #3533a1 100%)";
}
searchCity("Sydney");
