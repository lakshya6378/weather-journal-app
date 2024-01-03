const express = require("express")
require('dotenv').config()
 const app = express()
 const bodyParser = require("body-parser")
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(bodyParser.json());
 const cors = require("cors");
 app.use(cors());
 app.use(express.static('dist'));
 const port=8000;
 const projectData={
    name:"",
    temp:0,
    min_temp:0,
    max_temp:0,
    main:"",
    dt:0,
    sunrise:0,
    sunset:0,
    cityid:0,
 };
 const asyncfunction=async (len,lng,city)=>{
    const key="5b3f556adb4a2ae3aec7659b3cb25f41";
    const baseurl2=`https://api.openweathermap.org/data/2.5/weather?q=${city}`;
    const baseurl1=`https://api.openweathermap.org/data/2.5/weather?lat=${len}&lon=${lng}`;
    let response1= await fetch(`${baseurl2}&appid=${key}&units=metric`);
    try{
        let data1= await response1.json();
        if(data1.cod==="404")
        {
         response1=await fetch(`${baseurl1}&appid=${key}&units=metric`)
         try{
            data1=await response1.json();
         }
         catch(error)
         {
            console.log(error);
         }
        }
        projectData.name=data1.name;
      projectData.temp=data1.main.temp;
      projectData.min_temp=data1.main.temp_min;
      projectData.max_temp=data1.main.temp_max;
      projectData.main=data1.weather[0].main;
      projectData.dt=data1.dt;
      projectData.sunrise=data1.sys.sunrise;
      projectData.sunset=data1.sys.sunset;
      projectData.cityid=data1.id;
      return projectData;
    }
    catch(error){
        console.log("error",error)
    }

   
 }
 const adddata= async (req,res)=>{
    const city=req.query.city;
    console.log(city);
    const len=req.query.len;
    const lng=req.query.lng;
    console.log(len,lng);
    const data= await asyncfunction(len,lng,city);
    console.log(data);
    res.send(data);
 }
 const weatherData=[];
 const senddata=(req,res)=>{
    const newEntry={
        name:req.body.name,
        temp:req.body.temp,
        min_temp:req.body.min_temp,
        max_temp:req.body.max_temp,
        main:req.body.main,
        dt:req.body.dt,
        sunrise:req.body.sunrise,
        sunset:req.body.sunset,
        cityid:req.body.cityid,
    }
    weatherData.push(newEntry);
    res.send(weatherData);
 }
 const updatedata= (req,res)=>{
    res.send(weatherData[weatherData.length-1]);
 }
 app.get('/', function (req, res) {
   res.sendFile('dist/index.html')
})
 
 app.get('/addweatherdata',adddata);
 app.post('/sendweatherdata',senddata);
 app.get('/all',updatedata);

 const server = app.listen(port,listening);
 function listening(){
    console.log("server is running");
    console.log(`running on http://localhost:${process.env.PORT}`);
 };
 
 
