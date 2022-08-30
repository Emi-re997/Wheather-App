import React, { useState } from 'react';
import { Route } from "react-router-dom"
import './App.css';
import Nav from '../components/Nav.jsx';
import Cards from '../components/Cards.jsx';
import About from '../components/About/About.jsx';
import Ciudad from "../components/Ciudad.jsx";

const {REACT_APP_KEY_APP} = process.env;

function App() {
  const [cities, setCities] = useState([]);
  function onClose(id) {
    setCities(oldCities => oldCities.filter(c => c.id !== id));
  }
  function onSearch(ciudad) {
    //Llamado a la API del clima
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${REACT_APP_KEY_APP}`)
      .then(r => r.json())
      .then((r) => {
        if(r.main !== undefined){
          const ciudad = {
            min: Math.round(r.main.temp_min),
            max: Math.round(r.main.temp_max),
            img: r.weather[0].icon,
            id: r.id,
            wind: r.wind.speed,
            temp: r.main.temp,
            name: r.name,
            weather: r.weather[0].main,
            clouds: r.clouds.all,
            latitud: r.coord.lat,
            longitud: r.coord.lon
          };
          setCities(oldCities => [...oldCities, ciudad]);
        } else {
          alert("Ciudad no encontrada");
        }
      });
  }
  function onFilter(id) {
    let ciudad = cities.filter(c => c.id === parseInt(id));
    if(ciudad.length > 0) {
        return ciudad[0];
    } else {
        return null;
    }
  }
  
  return (
    
    <div className="App">


   
<div>
  <Route 
        path="/"
        render={()=> <Nav onSearch={onSearch}/>}
        />
 
  <Route 
        path="/"
        exact
        render={()=><Cards cities={cities} onClose={onClose} />}
        />

  <Route
        path="/ciudad/:id"
        render={({match})=>{
          const city = cities.find(
            (city)=> city.id === parseInt(match.params.id))
            return <Ciudad
                           city={city} 
                           />
        }}
  
  />
    <Route
        path="/about"
        render={()=><About />}
  />

  
   
   

</div>
  <hr/>
    </div>
  );
}

export default App;
