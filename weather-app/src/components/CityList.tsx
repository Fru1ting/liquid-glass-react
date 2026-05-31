import React from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { City } from '../types/weather';
import { useWeatherStore } from '../store/weatherStore';
import { getWeatherIcon } from '../utils/weatherIcons';
import GlassCard from './GlassCard';

interface CityListProps {
  cities: City[];
  currentCity: City | null;
  onSelectCity: (city: City) => void;
  onRemoveCity: (cityId: number) => void;
  weatherData: Record<number, { current: { temperature: number; weatherCode: number } }>;
}

export const CityList: React.FC<CityListProps> = ({
  cities,
  currentCity,
  onSelectCity,
  onRemoveCity,
  weatherData,
}) => {
  if (cities.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {cities.map((city) => {
        const isActive = currentCity?.id === city.id;
        const data = weatherData[city.id];

        return (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`relative flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-3xl transition-all duration-200 ${
              isActive
                ? 'bg-white/25 ring-2 ring-white/40'
                : 'bg-white/15 hover:bg-white/20'
            }`}
          >
            {isActive && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-white/60 text-xs font-medium">
              {city.name}
            </div>
            {data && (
              <>
                <div className="text-white">
                  {getWeatherIcon(data.current.weatherCode, 'w-8 h-8')}
                </div>
                <div className="text-white text-xl font-light">
                  {Math.round(data.current.temperature)}°
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CityList;
