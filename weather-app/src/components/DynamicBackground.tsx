import React, { useMemo, useEffect, useRef } from 'react';
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
  const gradientRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const { conditionColors, condition } = useMemo(() => {
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

    const baseColors: Record<WeatherCondition, string[]> = {
      'clear': ['#FFD700', '#4DA6FF', '#6C4AB6'],
      'partly-cloudy': ['#87CEEB', '#4DA6FF', '#87CEEB'],
      'cloudy': ['#B8B8B8', '#7A7A7A', '#5A5A5A'],
      'fog': ['#C8C8C8', '#A8A8A8', '#888888'],
      'drizzle': ['#98D8FF', '#64C2FF', '#3A8FFF'],
      'rain': ['#5C4CFF', '#9B59B6', '#E74C3C'],
      'snow': ['#F0F8FF', '#B0E0E6', '#87CEEB'],
      'thunderstorm': ['#4B0082', '#2C1654', '#1C002F'],
    };

    return { conditionColors: baseColors[condition], condition };
  }, [weatherCode]);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (gradientRef.current) {
        const rotation = (elapsed * 2) % 360;
        gradientRef.current.style.background = `
          linear-gradient(
            ${135 + rotation}deg,
            ${conditionColors[0]} 0%,
            ${conditionColors[1]} 50%,
            ${conditionColors[2]} 100%
          )
        `;
      }

      if (orb1Ref.current) {
        const x = Math.sin(elapsed * 0.3) * 50;
        const y = Math.cos(elapsed * 0.4) * 30;
        orb1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      if (orb2Ref.current) {
        const x = Math.cos(elapsed * 0.2) * 40;
        const y = Math.sin(elapsed * 0.5) * 35;
        orb2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [conditionColors]);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div
        ref={gradientRef}
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(135deg, ${conditionColors[0]} 0%, ${conditionColors[1]} 50%, ${conditionColors[2]} 100%)`,
          backgroundSize: '400% 400%',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      <svg className="absolute inset-0 w-full h-full opacity-15">
        <defs>
          <radialGradient id="mainGlow" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="subGlow1" cx="20%" cy="60%" r="30%">
            <stop offset="0%" stopColor={conditionColors[0]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={conditionColors[0]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="subGlow2" cx="80%" cy="70%" r="35%">
            <stop offset="0%" stopColor={conditionColors[2]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={conditionColors[2]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="30%" r="40%" fill="url(#mainGlow)" />
        <circle cx="20%" cy="60%" r="25%" fill="url(#subGlow1)" />
        <circle cx="80%" cy="70%" r="30%" fill="url(#subGlow2)" />
      </svg>

      <div
        ref={orb1Ref}
        className="absolute -top-1/3 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl opacity-25 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${conditionColors[0]} 0%, transparent 60%)`,
        }}
      />

      <div
        ref={orb2Ref}
        className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${conditionColors[2]} 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${conditionColors[1]} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
};

export default DynamicBackground;
