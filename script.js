const key = `82005d27a116c2880c8f0fcb866998a0`;
let body = document.getElementsByTagName("body");
let inputData = document.getElementById("input-display");
let status = document.getElementById("output");
let search = document.getElementById("search");
let weatherImg = document.querySelector(".img-fluid");
let weatherTemp = document.querySelector(".temp-details");
let weatherCondition = document.querySelector(".weather-conditions");
let cityLocation = document.querySelector(".city");
let countryLocation = document.querySelector(".country");
let loader = document.querySelector(".loader");
let container = document.querySelector(".weather-container");
let disable = document.querySelector(".disable");
let errorImg = document.querySelector(".img-fluiddd");
let errorMessage = document.querySelector(".weather-content");
let spinner = false;
const displayCurrentWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const weatherDeatils = await fetchData(latitude, longitude);
      displayWeatherInfo(weatherDeatils);
    }, () => {
      disable.style.display = "block";
      container.style.display = "none";
      errorImg.src = `icons/unknown.png`;
      errorMessage.innerHTML = "PERMISSION BLOCKED";
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

displayCurrentWeather();
const handleInputData = async () => {
  if (inputData.value == "") {
    alert("Enter city name");
  }
  else {
    const res = await getLatitudeLongitude(inputData.value);
    const lat = res?.lat
    const lon = res?.lon
    if (lat == undefined && lon == undefined) {
      disable.style.display = "block";
      container.style.display = "none";
      errorImg.src = `icons/unknown.png`;
      errorMessage.innerHTML = "NOT FOUND";
    } else {
      const weatherDeatils = await fetchData(lat, lon);
      displayWeatherInfo(weatherDeatils);
    }
  }
}
const getLatitudeLongitude = async (cityName) => {
  try {
    spinner = true;
    autoSpinner();
    container.style.display = "none";
    disable.style.display = "none";
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${key}`);
    spinner = false;
    autoSpinner();
    container.style.display = "block";
    const data = await res.json();
    return data[0];
  }
  catch (e) {
    console.log(e);
  }
}
const fetchData = async (_latitude, _longitude) => {
  try {
    spinner = true;
    autoSpinner();
    container.style.display = "none";
    disable.style.display = "none";
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${_latitude}&lon=${_longitude}&appid=${key}`
    );
    const APIINFO = await response.json();
    spinner = false;
    autoSpinner();
    container.style.display = "block";
    const description = APIINFO.weather[0].description;
    const WeatherCity = APIINFO.name;
    const tempInKelvin = APIINFO.main.temp;
    const tempInCelsius = Math.floor(tempInKelvin - 273.15) + "°";
    const countryName = APIINFO.sys.country;
    const iconCode = APIINFO.weather[0].icon;
    const condition = APIINFO.weather[0].main;
    return {
      description, WeatherCity, tempInCelsius, countryName, iconCode, condition
    }
  } catch (e) {
    console.log(e);
  }
};
const displayWeatherInfo = (weatherDeatils) => {
  container.style.display = "block";
  const { description, WeatherCity, tempInCelsius, countryName, iconCode, condition } = weatherDeatils;
  weatherImg.src = `icons/${iconCode}.png`;
  weatherTemp.innerHTML = tempInCelsius;
  weatherCondition.innerHTML = description;
  cityLocation.innerHTML = WeatherCity;
  countryLocation.innerHTML = countryName;
  document.body.style.backgroundImage = `url(/icons/${condition}.jpg)`;
}
search.addEventListener("click", handleInputData);
inputData.addEventListener("keydown", (e) => {
  if (e.value === "Enter") {
    search.click();
  }
});
const autoSpinner = () => {
  if (spinner)
    loader.style.display = "block";
  else
    loader.style.display = "none";
}










