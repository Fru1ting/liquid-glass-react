import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherState, City, WeatherData, AQIData } from '../types/weather';
import { fetchWeather, fetchAQI, searchCities } from '../services/weatherApi';

interface WeatherStore extends WeatherState {
  addCity: (city: City) => void;
  removeCity: (cityId: number) => void;
  setCurrentCity: (city: City | null) => void;
  fetchWeatherForCity: (city: City) => Promise<void>;
  fetchAQIForCity: (city: City) => Promise<void>;
  searchCity: (query: string) => Promise<void>;
  clearSearchResults: () => void;
  loadSavedData: () => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      cities: [],
      currentCity: null,
      weatherData: {},
      aqiData: {},
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      addCity: (city: City) => {
        const { cities } = get();
        if (!cities.find((c) => c.id === city.id)) {
          set({ cities: [...cities, city] });
          if (!get().currentCity) {
            set({ currentCity: city });
            get().fetchWeatherForCity(city);
            get().fetchAQIForCity(city);
          }
        }
      },

      removeCity: (cityId: number) => {
        const { cities, currentCity, weatherData, aqiData } = get();
        const newCities = cities.filter((c) => c.id !== cityId);
        const newWeatherData = { ...weatherData };
        const newAqiData = { ...aqiData };
        delete newWeatherData[cityId];
        delete newAqiData[cityId];

        let newCurrentCity = currentCity;
        if (currentCity?.id === cityId) {
          newCurrentCity = newCities[0] || null;
          if (newCurrentCity) {
            get().fetchWeatherForCity(newCurrentCity);
            get().fetchAQIForCity(newCurrentCity);
          }
        }

        set({
          cities: newCities,
          currentCity: newCurrentCity,
          weatherData: newWeatherData,
          aqiData: newAqiData,
        });
      },

      setCurrentCity: (city: City | null) => {
        set({ currentCity: city });
        if (city) {
          const { weatherData } = get();
          if (!weatherData[city.id]) {
            get().fetchWeatherForCity(city);
            get().fetchAQIForCity(city);
          }
        }
      },

      fetchWeatherForCity: async (city: City) => {
        set({ loading: true, error: null });
        try {
          const data = await fetchWeather(city);
          set((state) => ({
            weatherData: { ...state.weatherData, [city.id]: data },
            loading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to fetch weather data', loading: false });
        }
      },

      fetchAQIForCity: async (city: City) => {
        try {
          const data = await fetchAQI(city);
          set((state) => ({
            aqiData: { ...state.aqiData, [city.id]: data },
          }));
        } catch {
          // Silently fail for AQI
        }
      },

      searchCity: async (query: string) => {
        if (query.length < 2) {
          set({ searchResults: [] });
          return;
        }
        set({ searchLoading: true });
        try {
          const results = await searchCities(query);
          set({ searchResults: results, searchLoading: false });
        } catch {
          set({ searchResults: [], searchLoading: false });
        }
      },

      clearSearchResults: () => {
        set({ searchResults: [] });
      },

      loadSavedData: () => {
        const { cities, currentCity } = get();
        if (currentCity && cities.length > 0) {
          get().fetchWeatherForCity(currentCity);
          get().fetchAQIForCity(currentCity);
        }
      },
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        cities: state.cities,
        currentCity: state.currentCity,
      }),
    }
  )
);
