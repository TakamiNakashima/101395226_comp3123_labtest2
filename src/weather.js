import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = ({ apiKey }) => {
  const [city, setCity] = useState('Toronto');
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherIconUrl = (iconCode) => {
    // Example icon URL format: http://openweathermap.org/img/wn/10d.png
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch the 6 days forecast data
          const forecastResponse = await axios.get(
            `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
          );
          
          // Fetch the current weather data
          const currentWeatherResponse = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
      
          // Set the current weather data
          setWeatherData({
            current: currentWeatherResponse.data,
            forecast: forecastResponse.data.list.slice(1, 7) // Extract the next 6 days
          });
        } catch (error) {
          setError('Error fetching weather data');
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, [apiKey, city]);

  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date();
      const options = { weekday: 'long'};
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateCurrentDate();
  }, []);

  if (!weatherData) return <div>Loading...</div>;

  const handleCityChange = (event) => {
    const enteredCity = event.target.value;
    setCity(enteredCity.charAt(0).toUpperCase() + enteredCity.slice(1));
    //setCity(event.target.value);
  };

  const handleSearch = () => {
    const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className='searchBar'>
        <input className='searchBar'
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={handleCityChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className='container'>
        {weatherData && (
            <>
            <div className="currentWeatherContainer">
                <h2>{currentDate}</h2>
                <h3>{city}</h3>
                <img
                    src={getWeatherIconUrl(weatherData.current.weather[0].icon)}
                    alt="Weather Icon"
                />
                <p>{weatherData.current.weather[0].main}</p>
                <p>Temp: {weatherData.current.main.temp}</p>
                <p>Min: {weatherData.current.main.temp_min}</p>
                <p>Max: {weatherData.current.main.temp_max}</p>
                <p>Feels Like: {weatherData.current.main.feels_like}</p>
            </div>
            <div className="forecastContainer">
                {weatherData.forecast
                .filter((forecastData, index, array) => {
                    const currentDate = new Date(forecastData.dt * 1000).getDate();
                    return index === 0 || currentDate !== new Date(array[index - 1].dt * 1000).getDate();
                })
                .map((forecastData, index) => (
                    <div key={index} className="forecastItem">
                        <p>{formatDay(forecastData.dt)}</p>
                        <img
                            src={getWeatherIconUrl(forecastData.weather[0].icon)}
                            alt="Weather Icon"
                        />
                        <p>{forecastData.weather[0].main}</p>
                        <p>Temp: {forecastData.main.temp}</p>
                        <p>Min: {forecastData.main.temp_min}</p>
                        <p>Max: {forecastData.main.temp_max}</p>
                    </div>
                ))}
            </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Weather;
