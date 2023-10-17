import { useState, useEffect } from "react";
import "./weather.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import notFound from "./assets/404.png";
import clearUrl from "./assets/clear.png";
import rainUrl from "./assets/rain.png";
import snowUrl from "./assets/snow.png";
import cloudUrl from "./assets/cloud.png";
import mistUrl from "./assets/mist.png";
import React from "react";

const APIKey = "cb156f794debc5c3d9b19126fc05a33d";
/** https://openweathermap.org/api */
const defaultCity = 'Ростов-на-Дону';

const Weather = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState(defaultCity);
  const [currentCity, setCurrentCity] = useState(defaultCity);
  const [answerStatus, setAnswerStatus] = useState(200);

  const getWetherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
      );
      switch (response.data.weather[0].main) {
        case "Clear":
          setImgUrl(clearUrl);
          setDescription("безоблачно");
          break;
        case "Rain":
          setImgUrl(rainUrl);
          setDescription("дождь");
          break;
        case "Snow":
          setImgUrl(snowUrl);
          setDescription("снег");
          break;
        case "Clouds":
          setImgUrl(cloudUrl);
          setDescription("облачно");
          break;
        case "Haze":
          setImgUrl(mistUrl);
          setDescription("туман");
          break;
        default:
          setImgUrl("");
      }
      setTemp(response.data.main.temp);
      setHumidity(response.data.main.humidity);
      setWind(response.data.wind.speed);
      setAnswerStatus(200);
      setCurrentCity(city);
    } catch (error) {
      if (error instanceof Error) {
        setWind(null);
        setHumidity(null);
        setAnswerStatus(404);
      } else {
        console.log("неизвестная ошибка");
      }
    }
  };

  useEffect(() => {
    getWetherData();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      getWetherData();
    }
  }
  return (
    <>
      <div className="wcontainer">
        <div className="search-box">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="location"
          ></FontAwesomeIcon>
          <input
            type="text"
            placeholder="Ведите название"
            value={city}
            onChange={(e) => setCity(e.target.value.trim())}
            onKeyDown={handleKeyDown}
          />
          <div className="location"></div>
          <button onClick={() => getWetherData()}>
            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
          </button>
        </div>
        {answerStatus === 404 && (
          <div className="not-found fadeIn">
            <img src={notFound} alt="not found logo" />
            <p> Населенный пункт не найден</p>
          </div>
        )}
        {answerStatus === 200 && (
          <div className="weather-box fadeIn">
            <div className="titleBox">{currentCity}</div>
            <hr />
            <img src={imgUrl} alt='weather info'/>
            <div className="temperature">
              {temp}
              <span>°C</span>
            </div>
            <p className="description">{description}</p>
          </div>
        )}
        <div className="weather-details fadeIn">
          <div className="humidity">
            <FontAwesomeIcon
              icon={faWater}
              className="formatP"
            ></FontAwesomeIcon>
            <div className="wtext">
              <span>{humidity} %</span>
              <span>Влажность</span>
            </div>
          </div>
          <div className="wind fadeIn">
            <FontAwesomeIcon
              icon={faWind}
              className="formatP"
            ></FontAwesomeIcon>
            <div className="wtext">
              <span>{wind} км/ч</span>
              <span>Ветер</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
