const key = `82005d27a116c2880c8f0fcb866998a0`;
const inputData = document.getElementById("input-display");
const search = document.getElementById("search");
const weatherImg = document.getElementById("img-fluid");
const weatherTemp = document.querySelector(".temp-details");
const weatherCondition = document.getElementById("weather-conditions");
const cityLocation = document.getElementById("city");
const countryLocation = document.getElementById("country");
const loader = document.getElementById("loader");
const container = document.querySelector(".weather-container");
const disable = document.querySelector(".disable");
const errorImg = document.getElementById("img-fluiddd");
const errorMessage = document.getElementById("weather-content");
const cards = document.getElementById("cards");
const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
let flag = true;
const date = new Date();
let cardContent = '';
let spinner = false;
const currentLocationWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const weatherDeatils = await fetchData(latitude, longitude);
      weatherDeatils.forEach(element => {
        displayWeatherInfo(element);
      })

    }, () => {
      errorMessageHandler();
      errorMessage.innerHTML = "PERMISSION BLOCKED";
    });
  }
}

currentLocationWeather();
const handleInputData = async () => {
  cardContent = "";
  flag = true;
  if (inputData.value.trim() === "") {
    alert("Enter city name");
    inputData.value = "";
  }
  else {
    const res = await getLatitudeLongitude(inputData.value);
    const lat = res?.lat
    const lon = res?.lon
    if (lat && lon) {
      const weatherDeatils = await fetchData(lat, lon);
      inputData.value = "";
      weatherDeatils.forEach(element => {
        displayWeatherInfo(element);
      })
    }
    else {
      errorMessageHandler();
      errorMessage.innerHTML = "NOT FOUND";
      document.body.style.backgroundImage = `url(icons/bydefault.jpg)`;
      inputData.value = "";
    }
  }
}

const getLatitudeLongitude = async (cityName) => {
  try {
    autoSpinner(true);
    showCards(true);
    const jsonData = await fatchDataFromUrl(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${key}`);
    autoSpinner(false);
    showCards(false);
    return jsonData[0];
  }
  catch (e) {
    console.log(e);
  }
}
const fetchData = async (_latitude, _longitude) => {
  try {
    autoSpinner(true);
    showCards(true);
    const jsonResponse = await fatchDataFromUrl(`https://api.openweathermap.org/data/2.5/forecast?lat=${_latitude}&lon=${_longitude}&appid=${key}`);
    autoSpinner(false);
    showCards(false);
    const cityName = jsonResponse.city.name;
    const countryName = jsonResponse.city.country;
    let dataContainer;
    const fiveDaysData = [];
    jsonResponse.list.forEach((e) => {
      const forcasteDate = new Date(e.dt_txt).getDate();
      if (dataContainer != forcasteDate) {
        const day = dayNames[new Date(e.dt_txt).getDay()];
        const temp = e.main.temp;
        const tempInCelsius = Math.floor(temp - 273.15) + "°"
        const description = e.weather[0].description;
        const iconsCode = e.weather[0].icon;
        const weatherStatus = e.weather[0].main;
        fiveDaysData.push({ description, cityName, tempInCelsius, countryName, iconsCode, weatherStatus, day });
      }
      dataContainer = forcasteDate;
    })
    return fiveDaysData;
  } catch (e) {
    console.log(e);
  }
};
const displayWeatherInfo = (weatherDeatils) => {
  container.style.display = "block";
  const { description, cityName, tempInCelsius, countryName, iconsCode, weatherStatus, day } = weatherDeatils;
  if (flag === true) {
    weatherImg.src = `icons/${iconsCode}.png`;
    weatherTemp.innerHTML = tempInCelsius;
    weatherCondition.innerHTML = description;
    cityLocation.innerHTML = cityName;
    countryLocation.innerHTML = countryName;
    document.body.style.backgroundImage = `url(icons/${weatherStatus}.jpg)`;
  } else {
    cards.style.display = "flex";
    cardContent += `
      <div class="card">
       <h3>${day}</h3>
      <img src="icons/${iconsCode}.png" alt="">
      <div class="temp">
          <div class="temp-details">${tempInCelsius}</div>
          <div class="call">C</div>
      </div>
     
   </div>`
    cards.innerHTML = cardContent;
  }
  flag = false;
}
search.addEventListener("click", handleInputData);
const autoSpinner = (spinner) => {
  if (spinner)
    loader.style.display = "block";
  else
    loader.style.display = "none";
}
const showCards = (showcard) => {
  if (showcard) {
    container.style.display = "none";
    disable.style.display = "none";
    cards.style.display = "none";
  }
  else {
    container.style.display = "block";
    cards.style.display = "flex";
  }
}
const fatchDataFromUrl = async (url) => {
  const response = await fetch(url);
  const jsonResponse = await response.json();
  return jsonResponse;
}
const errorMessageHandler = () => {
  disable.style.display = "block";
  container.style.display = "none";
  cards.style.display = "none";
  errorImg.src = `icons/unknown.png`;
}
inputData.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleInputData();
  }
  else if (inputData.value === "" && e.keyCode === 32) {
    e.preventDefault();
    return;
  }
});
