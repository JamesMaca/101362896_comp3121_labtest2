import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WeatherComponentStyle.css'


export default function WeatherComponent() {

    const [weatherData, setWeatherData] = useState(null)
    const [city, setCity] = useState('')
    const [forecast, setForcast] = useState(null)

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                var res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=21becac8ed0a70a337dd3380c3b26724&units=metric`)
                console.log(res)
                console.log(res.data)
                console.log(res.data.data)
                setWeatherData(res.data)
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }

        fetchWeatherData();
    }, [city])

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                var res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=21becac8ed0a70a337dd3380c3b26724&units=metric`)
                console.log(res)
                console.log(res.data)
                setForcast(res.data)
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                      console.error("Forcast data not found");
                    } else {
                      console.error("Error status:", error.response.status);
                      console.error("Error data:", error.response.data);
                    }
                  } else if (error.request) {
                    console.error("No response received");
                  } else {
                    console.error("Error setting up the request", error.message);
                  }
            }
        }

        fetchForecastData();
    }, [weatherData])

    return (
        <div className='weather-container'>
            <div className='search-container'>
                <div className='search-bar'>
                    <input type="text" placeholder='Enter City' onChange={(e) => setCity(e.target.value)} />
                </div>
            </div>

            {weatherData && (
                <div className='weather-info'>
                    <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                    <div className='weather-desc'>
                        <p>{weatherData.weather[0].description}</p>
                        <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather Icon" />
                    </div>
                    <div className='temp'>
                        <p>Temperature: {weatherData.main.temp}°C</p>
                        <p>Humidity: {weatherData.main.humidity}%</p>
                        <p>Wind: {weatherData.wind.speed} km/h</p>
                        <p>Air Pressure: {weatherData.main.pressure} mb</p>
                        <p>Max Temp: {weatherData.main.temp_max} °C</p>
                        <p>Min Temp: {weatherData.main.temp_min} °C</p>

                        {forecast && (
                            <div className='weekly-forcast'>
                                <h3>5-Day Forcast</h3>
                                <ul>
                                    {forecast.list.reduce((acc, item) => {
                                        const date = new Date(item.dt * 1000)
                                        const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' })
                                        if(!acc.some(day => day.weekDay === weekDay)){
                                            acc.push({ 
                                                weekDay, 
                                                temp: item.main.temp,
                                                icon: item.weather[0].icon,
                                                description: item.weather[0].description
                                            })
                                        }
                                        return acc;
                                        
                                        }, []).slice(1, 7).map(day =>(
                                            <li key={day.weekDay}>
                                                <p>{day.weekDay}</p> 
                                                    <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} />
                                                <p>{day.temp}°C</p>
                                            </li>
                                        ))
                                    }
                                </ul>

                            </div>
                        )}
                        
                    </div>
                </div>
            )}
            <p>James MacAloney, 101362896</p>
        </div>
        
    )
}
