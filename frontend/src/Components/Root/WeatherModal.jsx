import { useEffect, useState } from "react";
import Modal from "../UI/Feedbacks/Modal";

export default function WeatherModal() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      () => setError("Location access denied")
    );
  }, []);

  async function fetchWeatherData(lat, lng) {
    try {
      const key = process.env.REACT_APP_GOOGLE_API_KEY;
      const res = await fetch(
        `https://weather.googleapis.com/v1/currentConditions:lookup?key=${key}&location.latitude=${lat}&location.longitude=${lng}`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeatherData(data);
    } catch (e) {
      setError(e.message || "Unable to fetch weather");
    }
  }

  return (
    <Modal className="add-theatre-dialog">
      <div className="add-theatre-form">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Weather</h2>
            {!error && weatherData && (
              <p className="text-sm opacity-80">{weatherData.timeZone.id}</p>
            )}
          </div>
        </div>

        {error && <p className="mt-4">{error}</p>}

        {!error && !weatherData && <p className="mt-4">Loading…</p>}

        {!error && weatherData && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <img
                src={`${weatherData.weatherCondition.iconBaseUri}.png`}
                alt={weatherData.weatherCondition.description.text}
                className="h-10 w-10"
              />
              <div>
                <p className="text-lg font-semibold">
                  {weatherData.weatherCondition.description.text}
                </p>
                <p className="text-sm opacity-80">
                  {new Date(weatherData.currentTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Temperature</span>
                <span className="font-semibold">
                  {Math.round(weatherData.temperature.degrees)}°C
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Feels like</span>
                <span className="font-semibold">
                  {Math.round(weatherData.feelsLikeTemperature.degrees)}°C
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Humidity</span>
                <span className="font-semibold">
                  {weatherData.relativeHumidity}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">UV index</span>
                <span className="font-semibold">{weatherData.uvIndex}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Wind</span>
                <span className="font-semibold">
                  {weatherData.wind.speed.value}{" "}
                  {weatherData.wind.speed.unit}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Precipitation</span>
                <span className="font-semibold">
                  {weatherData.precipitation.probability.percent}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Visibility</span>
                <span className="font-semibold">
                  {weatherData.visibility.distance} {weatherData.visibility.unit}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="opacity-80">Pressure</span>
                <span className="font-semibold">
                  {weatherData.airPressure.meanSeaLevelMillibars} mb
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
