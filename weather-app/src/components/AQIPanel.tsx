import React from 'react';
import GlassCard from './GlassCard';
import { getAQILevel } from '../utils/weatherIcons';
import { AQIData } from '../types/weather';

interface AQIPanelProps {
  aqiData: AQIData | null;
}

export const AQIPanel: React.FC<AQIPanelProps> = ({ aqiData }) => {
  if (!aqiData) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-white/80 text-sm font-medium mb-4">空气质量</h3>
        <div className="text-white/60 text-sm">暂无数据</div>
      </GlassCard>
    );
  }

  const aqiInfo = getAQILevel(aqiData.usAqi);

  const pollutants = [
    { label: 'PM2.5', value: aqiData.pm25.toFixed(1), unit: 'μg/m³' },
    { label: 'PM10', value: aqiData.pm10.toFixed(1), unit: 'μg/m³' },
    { label: 'O₃', value: aqiData.ozone.toFixed(1), unit: 'μg/m³' },
    { label: 'NO₂', value: aqiData.nitrogenDioxide.toFixed(1), unit: 'μg/m³' },
    { label: 'SO₂', value: aqiData.sulphurDioxide.toFixed(1), unit: 'μg/m³' },
    { label: 'CO', value: aqiData.carbonMonoxide.toFixed(1), unit: 'mg/m³' },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-white/80 text-sm font-medium mb-4">空气质量</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl font-light text-white">{aqiData.usAqi}</div>
        <div>
          <div className={`text-lg font-medium ${aqiInfo.color}`}>
            {aqiInfo.level}
          </div>
          <div className="text-white/60 text-xs">{aqiInfo.description}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {pollutants.slice(0, 6).map((pollutant) => (
          <div
            key={pollutant.label}
            className="p-2 rounded-xl bg-white/10 text-center"
          >
            <div className="text-white/60 text-xs mb-1">{pollutant.label}</div>
            <div className="text-white text-sm font-medium">
              {pollutant.value}
            </div>
            <div className="text-white/40 text-[10px]">{pollutant.unit}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default AQIPanel;
