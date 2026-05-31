import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, Eye } from 'lucide-react';
import GlassCard from './GlassCard';
import { formatTemperature, formatWindSpeed, formatHumidity } from '../utils/formatters';

interface DetailPanelProps {
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  apparentTemperature,
  humidity,
  windSpeed,
}) => {
  const details = [
    { icon: Thermometer, label: '体感温度', value: formatTemperature(apparentTemperature) },
    { icon: Droplets, label: '湿度', value: formatHumidity(humidity) },
    { icon: Wind, label: '风速', value: formatWindSpeed(windSpeed) },
    { icon: Gauge, label: '气压', value: '1013 hPa' },
    { icon: Eye, label: '能见度', value: '10 km' },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-white/80 text-sm font-medium mb-4">天气详情</h3>
      <div className="grid grid-cols-2 gap-4">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm"
          >
            <detail.icon className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-white/60 text-xs">{detail.label}</p>
              <p className="text-white font-medium">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default DetailPanel;
