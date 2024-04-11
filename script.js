const key = `82005d27a116c2880c8f0fcb866998a0`;
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
const cards = document.querySelector(".cards");
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let flag = true;
const date = new Date();
let cardContent = '';
let spinner = false;
const getDataForDay = (weatherItem) => {
  const day = dayNames[new Date(weatherItem.dt_txt).getDay()];
  const temp = weatherItem.main.temp;
  const tempInCelsius = Math.floor(temp - 273.15) + "°"
  const description = weatherItem.weather[0].description;
  const iconsCode = weatherItem.weather[0].icon;
  const weatherStatus = weatherItem.weather[0].main;
  return { tempInCelsius, description, iconsCode, weatherStatus, day };
}

const currentLocationWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const weatherDeatils = await fetchData(latitude, longitude);
      weatherDeatils.forEach(element => {
        displayWeatherInfo(element);
      })

    }, () => {
      disable.style.display = "block";
      container.style.display = "none";
      cards.style.display = "none";
      errorImg.src = `icons/unknown.png`;
      errorMessage.innerHTML = "PERMISSION BLOCKED";
    });
  }
}

currentLocationWeather();
const handleInputData = async () => {
  cardContent = "";
  flag = true;
  if (inputData.value.trim() == "") {
    alert("Enter city name");
    inputData.value = "";
  }
  else {
    const res = await getLatitudeLongitude(inputData.value);
    const lat = res?.lat
    const lon = res?.lon
    if(lat && lon){
      const weatherDeatils = await fetchData(lat, lon);
      inputData.value = "";
      weatherDeatils.forEach(element => {
        displayWeatherInfo(element);
      })}
    else{
      disable.style.display = "block";
      container.style.display = "none";
      cards.style.display = "none";
      errorImg.src = `icons/unknown.png`;
      errorMessage.innerHTML = "NOT FOUND";
      document.body.style.backgroundImage = `url(/icons/bydefault.jpg)`;
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
    const fiveDaysForcaste = [];
    const fiveDaysData = jsonResponse.list.filter((e) => {
      const forcasteDate = new Date(e.dt_txt).getDate();
      if (!(fiveDaysForcaste).includes(forcasteDate)) {
        return fiveDaysForcaste.push(forcasteDate);

      }
    })
    const forcastionDataObject = []
    fiveDaysData.forEach(element => {
      const { tempInCelsius, description, iconsCode, weatherStatus, day } = getDataForDay(element);
      const weatherDetailObj =
        { description, cityName, tempInCelsius, countryName, iconsCode, weatherStatus, day };
        forcastionDataObject.push(weatherDetailObj);

    });
    return forcastionDataObject;
  } catch (e) {
    console.log(e);
  }
};
const displayWeatherInfo = (weatherDeatils) => {
  container.style.display = "block";
  const { description, cityName, tempInCelsius, countryName, iconsCode, weatherStatus, day } = weatherDeatils;
  if (flag == true) {
    weatherImg.src = `icons/${iconsCode}.png`;
    weatherTemp.innerHTML = tempInCelsius;
    weatherCondition.innerHTML = description;
    cityLocation.innerHTML = cityName;
    countryLocation.innerHTML = countryName;
    document.body.style.backgroundImage = `url(/icons/${weatherStatus}.jpg)`;
  } else {
    cards.style.display = "flex";
    cardContent += `
      <div class="card">
       <h3>${day}</h3>
      <img src="icons/${iconsCode}.png" alt="">
      <div class="temp">
          <div class="temp-details">${tempInCelsius}</div>
          <div class="cal">C</div>
      </div>
       <div class="location">
           <div class="city">${cityName}</div>
           <div class="country">${countryName}</div>
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
const showCards=(e)=>{
if(e){
  container.style.display = "none";
  disable.style.display = "none";
  cards.style.display = "none";
}
else{
  container.style.display = "block";
  cards.style.display = "flex";
}
}
const fatchDataFromUrl=async(url)=>{
  const response = await fetch(url);
  const jsonResponse = await response.json();
  return jsonResponse;
}