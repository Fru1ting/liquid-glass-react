import { WeatherCodeInfo, WeatherCondition } from '../types/weather';
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Snowflake, CloudRainWind } from 'lucide-react';
import React from 'react';

const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: { condition: 'clear', label: '晴朗', icon: 'sun' },
  1: { condition: 'partly-cloudy', label: '晴转多云', icon: 'cloud-sun' },
  2: { condition: 'partly-cloudy', label: '多云', icon: 'cloud-sun' },
  3: { condition: 'cloudy', label: '阴天', icon: 'cloud' },
  45: { condition: 'fog', label: '雾', icon: 'cloud-fog' },
  48: { condition: 'fog', label: '霜雾', icon: 'cloud-fog' },
  51: { condition: 'drizzle', label: '毛毛雨', icon: 'cloud-drizzle' },
  53: { condition: 'drizzle', label: '毛毛雨', icon: 'cloud-drizzle' },
  55: { condition: 'drizzle', label: '毛毛雨', icon: 'cloud-drizzle' },
  56: { condition: 'drizzle', label: '冻毛毛雨', icon: 'cloud-drizzle' },
  57: { condition: 'drizzle', label: '冻毛毛雨', icon: 'cloud-drizzle' },
  61: { condition: 'rain', label: '小雨', icon: 'cloud-rain' },
  63: { condition: 'rain', label: '中雨', icon: 'cloud-rain' },
  65: { condition: 'rain', label: '大雨', icon: 'cloud-rain' },
  66: { condition: 'rain', label: '冻雨', icon: 'cloud-rain' },
  67: { condition: 'rain', label: '冻雨', icon: 'cloud-rain' },
  71: { condition: 'snow', label: '小雪', icon: 'cloud-snow' },
  73: { condition: 'snow', label: '中雪', icon: 'cloud-snow' },
  75: { condition: 'snow', label: '大雪', icon: 'cloud-snow' },
  77: { condition: 'snow', label: '雪粒', icon: 'snowflake' },
  80: { condition: 'rain', label: '阵雨', icon: 'cloud-rain-wind' },
  81: { condition: 'rain', label: '中阵雨', icon: 'cloud-rain-wind' },
  82: { condition: 'rain', label: '大阵雨', icon: 'cloud-rain-wind' },
  85: { condition: 'snow', label: '阵雪', icon: 'cloud-snow' },
  86: { condition: 'snow', label: '大阵雪', icon: 'cloud-snow' },
  95: { condition: 'thunderstorm', label: '雷暴', icon: 'cloud-lightning' },
  96: { condition: 'thunderstorm', label: '雷暴伴冰雹', icon: 'cloud-lightning' },
  99: { condition: 'thunderstorm', label: '雷暴伴大雨冰雹', icon: 'cloud-lightning' },
};

export const getWeatherInfo = (code: number): WeatherCodeInfo => {
  return weatherCodeMap[code] || { condition: 'clear' as WeatherCondition, label: '未知', icon: 'sun' };
};

export const getWeatherIcon = (code: number, className?: string): React.ReactNode => {
  const info = getWeatherInfo(code);
  const iconClass = className || 'w-12 h-12';

  switch (info.icon) {
    case 'sun':
      return <Sun className={iconClass} />;
    case 'cloud-sun':
      return <CloudSun className={iconClass} />;
    case 'cloud':
      return <Cloud className={iconClass} />;
    case 'cloud-fog':
      return <CloudFog className={iconClass} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={iconClass} />;
    case 'cloud-rain':
      return <CloudRain className={iconClass} />;
    case 'cloud-rain-wind':
      return <CloudRainWind className={iconClass} />;
    case 'cloud-snow':
      return <CloudSnow className={iconClass} />;
    case 'snowflake':
      return <Snowflake className={iconClass} />;
    case 'cloud-lightning':
      return <CloudLightning className={iconClass} />;
    default:
      return <Sun className={iconClass} />;
  }
};

export const getConditionColor = (condition: WeatherCondition): string => {
  const colors: Record<WeatherCondition, string> = {
    'clear': 'from-yellow-400 via-blue-400 to-blue-600',
    'partly-cloudy': 'from-blue-300 via-blue-400 to-blue-500',
    'cloudy': 'from-gray-400 via-gray-500 to-gray-600',
    'fog': 'from-gray-300 via-gray-400 to-gray-500',
    'drizzle': 'from-blue-300 via-blue-400 to-blue-500',
    'rain': 'from-blue-600 via-indigo-500 to-purple-600',
    'snow': 'from-blue-100 via-blue-200 to-blue-300',
    'thunderstorm': 'from-purple-700 via-purple-600 to-gray-700',
  };
  return colors[condition] || colors.clear;
};

export const getAQILevel = (aqi: number): { level: string; color: string; description: string } => {
  if (aqi <= 50) return { level: '优', color: 'text-green-400', description: '空气质量令人满意' };
  if (aqi <= 100) return { level: '良', color: 'text-yellow-400', description: '空气质量可接受' };
  if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-400', description: '敏感人群需注意' };
  if (aqi <= 200) return { level: '中度污染', color: 'text-red-400', description: '所有人群需注意' };
  if (aqi <= 300) return { level: '重度污染', color: 'text-purple-500', description: '健康人群需减少户外活动' };
  return { level: '严重污染', color: 'text-red-700', description: '健康人群应避免户外活动' };
};
