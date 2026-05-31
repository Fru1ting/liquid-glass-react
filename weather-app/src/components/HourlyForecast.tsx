import React from 'react';
import GlassCard from './GlassCard';
import { getWeatherIcon } from '../utils/weatherIcons';
import { formatHourShort, formatHour } from '../utils/formatters';
import { HourlyWeather } from '../types/weather';

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const first24Hours = hourlyData.slice(0, 24);

  return (
    <GlassCard className="p-6">
      <h3 className="text-white/80 text-sm font-medium mb-4">小时预报</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {first24Hours.map((hour, index) => (
          <div
            key={hour.time}
            className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl min-w-[72px] transition-all duration-200 hover:bg-white/10 ${
              index === 0 ? 'bg-white/20' : 'bg-white/10'
            }`}
          >
            <span className="text-white/70 text-xs font-medium">
              {index === 0 ? '现在' : formatHourShort(hour.time)}
            </span>
            <div className="text-white">
              {getWeatherIcon(hour.weatherCode, 'w-8 h-8')}
            </div>
            <span className="text-white font-medium">
              {Math.round(hour.temperature)}°
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default HourlyForecast;
