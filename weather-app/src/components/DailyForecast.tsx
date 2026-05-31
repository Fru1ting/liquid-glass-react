import React from 'react';
import GlassCard from './GlassCard';
import { getWeatherIcon } from '../utils/weatherIcons';
import { formatDate, formatTemperature } from '../utils/formatters';
import { DailyWeather } from '../types/weather';

interface DailyForecastProps {
  dailyData: DailyWeather[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-white/80 text-sm font-medium mb-4">未来天气预报</h3>
      <div className="space-y-2">
        {dailyData.map((day, index) => (
          <div
            key={day.date}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 ${
              index === 0 ? 'bg-white/20' : 'bg-white/10'
            }`}
          >
            <span className="text-white font-medium w-16">{formatDate(day.date)}</span>
            <div className="flex items-center gap-2">
              {getWeatherIcon(day.weatherCode, 'w-6 h-6 text-white/90')}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium w-10 text-right">
                {Math.round(day.tempMax)}°
              </span>
              <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  style={{
                    width: `${((day.tempMax - day.tempMin) / 30) * 100}%`,
                    marginLeft: `${((day.tempMin + 10) / 50) * 100}%`,
                  }}
                />
              </div>
              <span className="text-white/60 w-10">
                {Math.round(day.tempMin)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default DailyForecast;
