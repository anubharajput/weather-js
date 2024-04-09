const key = `82005d27a116c2880c8f0fcb866998a0`;
let latitude = 0;
let longitude = 0;
const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
let cityName=document.getElementById("input-display");
let status=document.getElementById("output");
let search=document.getElementById("search");
search.addEventListener("click",()=>{

})

search.addEventListener("click",async()=>{
    console.log(cityName.innerHTML);
    let res=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName.innerHTML}&limit=5&appid=${key}`;
          const data = await res.json();
          const { lat, lon } = data[0];
          console.log({lat,lon});
        
})
const fetchData = async (_latitude, _longitude) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
      );
        const APIINFO = await response.json();
        const description = data.weather[0].description;
        const InKelvin = data.main.temp;
        const InCelcius = Math.floor(InKelvin - 273.15);
        const city = data.name;
        const country = data.sys.country;
        const weather = data.weather[0].main;
        const icon = data.weather[0].icon;
        const hum= data.main.humidity;
        const windINFO = data.wind.speed;
  
        return {
          APIINFO,
          InCelcius,
          city,
          country,
          weather,
          icon,
          hum,
          windINFO,
      }
    } catch (e) {
      console.log(e);
    }
  };

  