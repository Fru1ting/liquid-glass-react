import React, { useEffect, useState } from 'react';
import { useWeatherStore } from './store/weatherStore';
import { fetchWeather, fetchAQI } from './services/weatherApi';
import WeatherCard from './components/WeatherCard';
import DetailPanel from './components/DetailPanel';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import AQIPanel from './components/AQIPanel';
import CityList from './components/CityList';
import CitySearch from './components/CitySearch';
import DynamicBackground from './components/DynamicBackground';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import { MapPin } from 'lucide-react';

function App() {
  const {
    cities,
    currentCity,
    weatherData,
    aqiData,
    loading,
    error,
    addCity,
    removeCity,
    setCurrentCity,
    fetchWeatherForCity,
    fetchAQIForCity,
    loadSavedData,
  } = useWeatherStore();

  const [showSearch, setShowSearch] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (cities.length === 0) {
        const defaultCities = [
          { id: 1816670, name: '北京', latitude: 39.9042, longitude: 116.4074, country: '中国', timezone: 'Asia/Shanghai' },
        ];
        defaultCities.forEach(city => {
          addCity(city);
          setCurrentCity(city);
        });
      }
      setInitializing(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (currentCity && cities.length > 0) {
      fetchWeatherForCity(currentCity);
      fetchAQIForCity(currentCity);
    }
  }, [currentCity?.id]);

  const handleRefresh = () => {
    if (currentCity) {
      fetchWeatherForCity(currentCity);
      fetchAQIForCity(currentCity);
    }
  };

  const currentWeather = currentCity ? weatherData[currentCity.id] : null;
  const currentAQI = currentCity ? aqiData[currentCity.id] : null;

  if (initializing || (loading && !currentWeather)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="正在获取天气数据..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans">
      {currentWeather && (
        <DynamicBackground weatherCode={currentWeather.current.weatherCode} />
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation
          currentCity={currentCity}
          onMenuClick={() => {}}
          onAddClick={() => setShowSearch(true)}
          onRefresh={handleRefresh}
          loading={loading}
        />

        <main className="flex-1 px-4 pb-8">
          {cities.length > 1 && (
            <div className="mb-6">
              <CityList
                cities={cities}
                currentCity={currentCity}
                onSelectCity={setCurrentCity}
                onRemoveCity={removeCity}
                weatherData={weatherData}
              />
            </div>
          )}

          {!currentCity || !currentWeather ? (
            <div className="flex flex-col items-center justify-center py-20">
              <MapPin className="w-16 h-16 text-white/40 mb-4" />
              <p className="text-white/60 text-lg mb-6">添加一个城市开始使用</p>
              <button
                onClick={() => setShowSearch(true)}
                className="px-6 py-3 rounded-2xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
              >
                搜索城市
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              <WeatherCard
                temperature={currentWeather.current.temperature}
                weatherCode={currentWeather.current.weatherCode}
                cityName={currentCity.name}
                country={currentCity.country}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailPanel
                  apparentTemperature={currentWeather.current.apparentTemperature}
                  humidity={currentWeather.current.humidity}
                  windSpeed={currentWeather.current.windSpeed}
                />
                <AQIPanel aqiData={currentAQI || null} />
              </div>

              <HourlyForecast hourlyData={currentWeather.hourly} />

              <DailyForecast dailyData={currentWeather.daily} />
            </div>
          )}
        </main>

        {error && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-red-500/80 text-white text-sm">
            {error}
          </div>
        )}
      </div>

      {showSearch && <CitySearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default App;
