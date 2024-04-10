const key = `82005d27a116c2880c8f0fcb866998a0`;
const body = document.getElementsByTagName("body");
const inputData = document.getElementById("input-display");
const search = document.getElementById("search");
const weatherImg = document.querySelector(".img-fluid");
const weatherTemp = document.querySelector(".temp-details");
const weatherCondition = document.querySelector(".weather-conditions");
const cityLocation = document.querySelector(".city");
const countryLocation = document.querySelector(".country");
const loader = document.querySelector(".loader");
const container = document.querySelector(".weather-container");
const disable = document.querySelector(".disable");
const errorImg = document.querySelector(".img-fluiddd");
const errorMessage = document.querySelector(".weather-content");
let spinner = false;
const currentLocationWeather = () => {
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

currentLocationWeather();
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
    const jsonData = await res.json();
    return jsonData[0];
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
    const jsonResponse = await response.json();
    spinner = false;
    autoSpinner();
    container.style.display = "block";
    const description = jsonResponse.weather[0].description;
    const cityName = jsonResponse.name;
    const tempInKelvin = jsonResponse.main.temp;
    const tempInCelsius = Math.floor(tempInKelvin - 273.15) + "°";
    const countryName = jsonResponse.sys.country;
    const iconCode = jsonResponse.weather[0].icon;
    const weatherStatus = jsonResponse.weather[0].main;
    return {
      description, cityName, tempInCelsius, countryName, iconCode, weatherStatus
    }
  } catch (e) {
    console.log(e);
  }
};
const displayWeatherInfo = (weatherDeatils) => {
  container.style.display = "block";
  const { description, WeatherCity, tempInCelsius, countryName, iconCode, weatherStatus } = weatherDeatils;
  weatherImg.src = `icons/${iconCode}.png`;
  weatherTemp.innerHTML = tempInCelsius;
  weatherCondition.innerHTML = description;
  cityLocation.innerHTML = WeatherCity;
  countryLocation.innerHTML = countryName;
  document.body.style.backgroundImage = `url(/icons/${weatherStatus}.jpg)`;
}
search.addEventListener("click", handleInputData);
const autoSpinner = () => {
  if (spinner)
    loader.style.display = "block";
  else
    loader.style.display = "none";
}
