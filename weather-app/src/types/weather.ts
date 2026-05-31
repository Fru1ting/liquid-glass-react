export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  lastUpdated: Date;
}

export interface AQIData {
  usAqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
}

export interface WeatherState {
  cities: City[];
  currentCity: City | null;
  weatherData: Record<number, WeatherData>;
  aqiData: Record<number, AQIData>;
  loading: boolean;
  error: string | null;
  searchResults: City[];
  searchLoading: boolean;
}

export interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone: string;
  }>;
}

export interface OpenMeteoAQIResponse {
  current: {
    time: string;
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    carbon_monoxide: number;
  };
}

export type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';

export interface WeatherCodeInfo {
  condition: WeatherCondition;
  label: string;
  icon: string;
}
