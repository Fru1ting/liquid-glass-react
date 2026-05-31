import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-white/60 animate-spin mb-4" />
      <p className="text-white/60">{message}</p>
    </div>
  );
};

export default Loading;
