import React from 'react';
import { getWeatherIcon, getWeatherInfo, getConditionColor } from '../utils/weatherIcons';
import GlassCard from './GlassCard';

interface WeatherCardProps {
  temperature: number;
  weatherCode: number;
  cityName: string;
  country: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  weatherCode,
  cityName,
  country,
}) => {
  const weatherInfo = getWeatherInfo(weatherCode);
  const gradientClass = getConditionColor(weatherInfo.condition);

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-[28px] blur-3xl opacity-60`}
      />
      <GlassCard className="p-8 md:p-12">
        <div className="flex flex-col items-center justify-center text-white">
          <p className="text-lg md:text-xl font-medium opacity-90 mb-2">
            {cityName}, {country}
          </p>

          <div className="my-6 md:my-8">
            {getWeatherIcon(weatherCode, 'w-24 h-24 md:w-32 md:h-32')}
          </div>

          <h1 className="text-8xl md:text-9xl font-extralight tracking-tighter mb-2">
            {Math.round(temperature)}°
          </h1>

          <p className="text-2xl md:text-3xl font-light opacity-90">
            {weatherInfo.label}
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default WeatherCard;
