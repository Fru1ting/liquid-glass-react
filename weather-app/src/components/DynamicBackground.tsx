import React, { useMemo } from 'react';
import { WeatherCondition } from '../types/weather';
import { getConditionColor } from '../utils/weatherIcons';

interface DynamicBackgroundProps {
  weatherCode: number;
  className?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  weatherCode,
  className = '',
}) => {
  const conditionColors = useMemo(() => {
    const codeMap: Record<number, WeatherCondition> = {
      0: 'clear',
      1: 'partly-cloudy',
      2: 'partly-cloudy',
      3: 'cloudy',
      45: 'fog',
      48: 'fog',
      51: 'drizzle',
      53: 'drizzle',
      55: 'drizzle',
      56: 'drizzle',
      57: 'drizzle',
      61: 'rain',
      63: 'rain',
      65: 'rain',
      66: 'rain',
      67: 'rain',
      71: 'snow',
      73: 'snow',
      75: 'snow',
      77: 'snow',
      80: 'rain',
      81: 'rain',
      82: 'rain',
      85: 'snow',
      86: 'snow',
      95: 'thunderstorm',
      96: 'thunderstorm',
      99: 'thunderstorm',
    };

    const condition = codeMap[weatherCode] || 'clear';
    const gradientClass = getConditionColor(condition);

    const baseColors: Record<WeatherCondition, string[]> = {
      'clear': ['#FF9500', '#007AFF', '#5856D6'],
      'partly-cloudy': ['#5AC8FA', '#007AFF', '#5AC8FA'],
      'cloudy': ['#8E8E93', '#636366', '#48484A'],
      'fog': ['#AEAEB2', '#8E8E93', '#636366'],
      'drizzle': ['#64D2FF', '#5AC8FA', '#007AFF'],
      'rain': ['#5856D6', '#AF52DE', '#FF2D55'],
      'snow': ['#FFFFFF', '#B4D7FF', '#87CEEB'],
      'thunderstorm': ['#5E17EB', '#301934', '#1C1425'],
    };

    return baseColors[condition];
  }, [weatherCode]);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `linear-gradient(135deg, ${conditionColors[0]} 0%, ${conditionColors[1]} 50%, ${conditionColors[2]} 100%)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="30%" r="30%" fill="url(#sunGlow)" />
      </svg>

      <div
        className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${conditionColors[0]} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{
          background: `radial-gradient(circle, ${conditionColors[2]} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default DynamicBackground;
