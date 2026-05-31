import {
  OpenMeteoWeatherResponse,
  OpenMeteoGeocodingResponse,
  OpenMeteoAQIResponse,
  City,
  WeatherData,
  AQIData,
  HourlyWeather,
  DailyWeather,
} from '../types/weather';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';
const AQI_API_BASE = 'https://air-quality-api.open-meteo.com/v1';

export const fetchWeather = async (city: City): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m'].join(','),
    hourly: ['temperature_2m', 'weather_code'].join(','),
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: OpenMeteoWeatherResponse = await response.json();

  const hourly: HourlyWeather[] = data.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    weatherCode: data.hourly.weather_code[index],
  }));

  const daily: DailyWeather[] = data.daily.time.map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
  }));

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
    },
    hourly,
    daily,
    lastUpdated: new Date(),
  };
};

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'zh',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_API_BASE}/search?${params}`);

  if (!response.ok) {
    throw new Error('Failed to search cities');
  }

  const data: OpenMeteoGeocodingResponse = await response.json();

  if (!data.results) return [];

  return data.results.map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    timezone: result.timezone,
    admin1: result.admin1,
  }));
};

export const fetchAQI = async (city: City): Promise<AQIData> => {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: ['us_aqi', 'pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide', 'sulphur_dioxide', 'carbon_monoxide'].join(','),
  });

  const response = await fetch(`${AQI_API_BASE}/air-quality?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch AQI data');
  }

  const data: OpenMeteoAQIResponse = await response.json();

  return {
    usAqi: data.current.us_aqi,
    pm25: data.current.pm2_5,
    pm10: data.current.pm10,
    ozone: data.current.ozone,
    nitrogenDioxide: data.current.nitrogen_dioxide,
    sulphurDioxide: data.current.sulphur_dioxide,
    carbonMonoxide: data.current.carbon_monoxide,
  };
};
