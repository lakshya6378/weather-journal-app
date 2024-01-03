 import Cloudy from  './images/cloudyanimated.svg'
// import hazeday from './images/hazeday.jpg'
import thunder from './images/thunderanimated.svg'
// import thunderstormday from './images/thunderstormday.jpg'
 import rainy6 from './images/rainy-6animated.svg'
// import drizzleday from './images/Drizzleday.jpg'
import rainy7 from './images/rainy-7animated.svg'
// import rainday from './images/rainday.jpg'
import daycl from './images/dayanimated.svg'
// import clearday from './images/clearday.jpg'
// import cloudandmoon from './images/cloudandmoonnight.jpg'
import snowy3 from './images/snowy-3animated.svg'
// import snowday from './images/snowday.jpg'
import haze from './images/haze.png'
 import cloudynight1 from './images/cloudy-night-1animated.svg'
// import hazenight from './images/hazenight.jpg'
// import thunderstormnight from './images/thunderstormnight.jpg'
// import rainnight from './images/rainnight.jpg'
// import drizzlenight from './images/Drizzlenight.jpg'
 import night from './images/nightanimated.svg'
// import cleannight from './images/clearnight.jpg'
// import snownight from './images/snownight.jpg'
import weather from './images/weather.svg'
import  weatherstatic from  './images/weatherstatic.png'
import searchicon from './images/search-svgrepo-com.svg'
document.getElementsByTagName('link')[0].href=`${weatherstatic}`;
document.getElementsByTagName('img')[1].src=`${searchicon}`;
document.getElementsByTagName('img')[0].src=`${weather}`;
const searchbutton=document.getElementById('search-button')
searchbutton.addEventListener('click',performaction)
function performaction(e){
 const city=document.getElementById('input').value;
 searchbutton.classList.add('clicked-button');
    setTimeout(() => {
        searchbutton.classList.remove('clicked-button');
    }, 300);

   getweatherdata(city)
   .then(function(data){
    if(data)
    {
      sendweatherdata('/sendweatherdata',{
        name:data.name,
        temp:data.temp,
    min_temp:data.min_temp,
    max_temp:data.max_temp,
    main:data.main,
    dt:data.dt,
    sunrise:data.sunrise,
    sunset:data.sunset,
    cityid:data.cityid,
      });
    }
   } )
   .then(
    updateUI);
}
window.onload=function()
{
    getweatherdata("jaipur")
   .then(function(data){
      sendweatherdata('/sendweatherdata',{
        name:data.name,
        temp:data.temp,
    min_temp:data.min_temp,
    max_temp:data.max_temp,
    main:data.main,
    dt:data.dt,
    sunrise:data.sunrise,
    sunset:data.sunset,
    cityid:data.cityid,
      });
   } )
   .then(
    updateUI);
}

function destroyWeatherWidget() {
    const existingWidget = document.getElementById('openweathermap-widget-1');
    if (existingWidget) {
        if(window.myWidgetParam) 
        delete window.myWidgetParam ;
        existingWidget.innerHTML = ''; // Remove the existing widget content
    }
}
const getweatherdata = async (city) => {
    // console.log(process.env.GOOGLE_API_KEY);
    const address = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GOOGLE_API_KEY}`);

    try {
        const citydata = await address.json();
        if (citydata.status!=="OK") {
            // Display an alert and return early if the response is not successful
            alert("Enter a valid city name or PIN code");
            document.getElementById('input').value = "";
            return;
        }
        const addressPattern = /^[^\d]+$/;
        const zipCodepattern = /^\d{6}$/;

        let cityname = "";
        let lat, lon;

        if (addressPattern.test(city)) {
            cityname = citydata.results[0].address_components[0].long_name;
        } else if (zipCodepattern.test(city)) {
            cityname = citydata.results[0].address_components[1].long_name;
        } else {
            alert("Enter a valid city name or PIN code");
            return;
        }

        lat = citydata.results[0].geometry.location.lat;
        lon = citydata.results[0].geometry.location.lng;

        console.log(cityname);

        // Continue with the rest of your code, e.g., fetch weather data and update UI
        const response = await fetch(`/addweatherdata?city=${cityname}&len=${lat}&lng=${lon}`);
        const data = await response.json();

        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const sendweatherdata = async(url='',data={})=>{
    const response= await fetch(url,{
        method:'POST',
        credentials:'same-origin',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(data),  
      })
      try{
        const newdata=await response.json();
        console.log(newdata);
        return newdata;
      }
      catch(error)
      {
        console.log("error",error);
      }
    }
    const isDayTime=(dt,sunrise,sunset)=>{
        const currentTimestamp = dt; 
  const sunriseTimestamp = sunrise;
  const sunsetTimestamp = sunset;
  const currentDateTime = new Date(currentTimestamp * 1000);
  const sunriseDateTime = new Date(sunriseTimestamp * 1000);
  const sunsetDateTime = new Date(sunsetTimestamp * 1000);

  return currentDateTime > sunriseDateTime && currentDateTime < sunsetDateTime;
    }
const updateUI=async ()=>{
    destroyWeatherWidget();
    const response = await fetch('/all')
    try{
        const alldata= await response.json()
        document.querySelector('.city-name').innerHTML=alldata.name;
        document.querySelector('.temperature').innerHTML=alldata.temp;
        document.querySelector('.min-max-temp').innerHTML=`${alldata.min_temp}&deg;/${alldata.max_temp}&deg;`;
        const timestamp = alldata.dt; 
        const date = new Date(timestamp * 1000); 
        const year = date.getFullYear();
        const month = date.getMonth() + 1; 
        const day = date.getDate();
        window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  
        window.myWidgetParam.push({id: 1,cityid: `${alldata.cityid}`,appid: '5b3f556adb4a2ae3aec7659b3cb25f41',units: 'metric',containerid: 'openweathermap-widget-1',  }); 
         (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();
            document.querySelector('#date').innerHTML=`Date: ${year}-${month}-${day}`;
        if(isDayTime(timestamp,alldata.sunrise,alldata.sunset))
        {
        switch(alldata.main)
        {
            case "Haze":
                document.querySelector('.city-container img').src=`${Cloudy}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYQLF5tF2RG2XRTN8Y7GORmI7hC8fgMONiEuc0VDWjVD1_XpXOo5s_K7-Nj1av21Y2WGVDwMulhwWZ6QNhXmVLfLIhpNNw=s1600)`
                break;
            case "Thunderstorm":
                document.querySelector('.city-container img').src=`${thunder}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTgwM7G3Ia9kp5BrjMmZDfZMg_STYvfKudXQcaODQ9MR6f4xEsgWJ3mWXGjjyPfLLaNlB5TqdncdAfYLZm_9WEpouHkvA=s1600)`
                break;
            case "Drizzle":
                document.querySelector('.city-container img').src=`${rainy6}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYStJcUiug-zvkUQLykZ7aFDfjrkTY6eTJu8luQFw91OS86CiOmnnQBnrkSJC0m9iBGDAEx7BCfBMy7xeCFOId9zuuOQmw=s1600)`
                break;
            case "Rain":
                document.querySelector('.city-container img').src=`${rainy7}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYRWpb5iBAf3rVbjyHt7WM7DmHrmSdZtAQr372ycNLr5oC7i7WW_LZ7aFmEJVrqZ5JpXObahBqOHNyvucmGrxaHyJAiENw=s1600)`
                break;
            case "Clear":
                document.querySelector('.city-container img').src=`${daycl}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYSFBnemH99xFbWlreBtnxTbv2V4h4_fPdim6CGuXcITJ6X7njviBsHFHr8qrOklbeS5GGYICBXl59lsxdKG6Pc7j3g2Ww=s1600)`
                break;
            case "Clouds":
                document.querySelector('.city-container img').src=`${Cloudy}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTzhg7QYngjd4NfkvPWXy_sWPVDIjb2a6onkt67-Stu5Ka5gctUfwIBqcxq55LQ_hXfiyxqBEWhqE6VclOV4VK2J6lBxA=s1600)`
                break;
            case "Snow":
                document.querySelector('.city-container img').src=`${snowy3}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTjiolb0JWXTR8J1Mlj6Dx-1bGAD2nWm0m6ihOC1zQWqgfkeze-NusJiuTe-c8g8OlYUGfdzp5j3_iZyaql4yDmBjK7=s1600)`
                break;
            default :
                document.querySelector('.city-container img').src=`${haze}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYQLF5tF2RG2XRTN8Y7GORmI7hC8fgMONiEuc0VDWjVD1_XpXOo5s_K7-Nj1av21Y2WGVDwMulhwWZ6QNhXmVLfLIhpNNw=s1600)`
                break;
        }
    }
      else{
        switch(alldata.main)
        {
            case "Haze":
                document.querySelector('.city-container img').src=`${cloudynight1}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYRHrvb0ceJeO3hzfAEKqQFplVTM6UDpvkijmbooRsAkluZxQHaDu87DRzp-8alqHFQy0M71zRwY2WE4HvE3iACTE4kAbw=s1600)`
                break;
            case "Thunderstorm":
                document.querySelector('.city-container img').src=`${thunder}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTtrhxlgPm2VjzRRw_Jm7Xz3eoPr8226EC710AJ9UDT7Bx_cFgVW0PK9tIvItsEVlb5lMnm05UWl1LjRZ-6njCcQM-W=s1600)`
                break;
            case "Drizzle":
                document.querySelector('.city-container img').src=`${rainy6}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTxktUHlp5AYYuLe2V6BAo2KYwiLYr_HupVUihhU-UBYsSeTlSRWkYPuazw5GJjFrnLYy4nxoGXeaj4xEgWUXTzcwjDIA=s1600)`
                break;
            case "Rain":
                document.querySelector('.city-container img').src=`${rainy7}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYQXE3b9uVaBVim2PJNufBb-wJjNIzHkiJuagbZvekpWuhYMecF6l4fgG-M6B1bFbuT980DnPuT8fuISIWQQqFPGNmE-5g=s1600)`
                break;
            case "Clear":
                document.querySelector('.city-container img').src=`${night}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYRul43v10YMCObPGSLljOltYT8KGsAI7wESoa27a7OBTLK1sW5aClKfGf0mHvBuR654rtEzCV9g3BXrjaQmTyfi5bEz=s1600)`
                break;
            case "Clouds":
                document.querySelector('.city-container img').src=`${Cloudy}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYSjqOKZneLCXzpDGCY8BgoUI5c-AmTVIpuJnT5azHcocceM9kTKaEx6eE4_EtO4G5XidvokIc2Sx31gNWhQ9QViebYJXg=s1600)`
                break;
            case "Snow":
                document.querySelector('.city-container img').src=`${snowy3}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYReZH08p5GesdpsZqEvsxhXhXtGfnN98m7XYUpbQ2WrUY5KiON1WfpGEBzINMrtJbFd5-n5VYrRaR7KUM3iIX3lj2_R6g=s1600)`
                break;
            default :
                document.querySelector('.city-container img').src=`${haze}`;
                document.querySelector('body').style.backgroundImage=`url(https://lh3.googleusercontent.com/drive-viewer/AEYmBYTWZiNn2XiA-OyKHTQkPDmECmn5OSCfUtinrklXRihHwxbv1G0goVter-K1VwyR6Ns0OD8udl7TT3Vz-x0r5OA9F658Dg=s1600)`
                break;
        }
      }
      
    }
    catch(error){
        console.log("error",error);
    }
}