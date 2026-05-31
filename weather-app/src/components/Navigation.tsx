import React from 'react';
import { Menu, Plus, RefreshCw } from 'lucide-react';
import { City } from '../types/weather';

interface NavigationProps {
  currentCity: City | null;
  onMenuClick: () => void;
  onAddClick: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentCity,
  onMenuClick,
  onAddClick,
  onRefresh,
  loading,
}) => {
  return (
    <nav className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onMenuClick}
        className="p-3 rounded-2xl text-white/80 hover:bg-white/10 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2">
        {currentCity && (
          <h1 className="text-white text-lg font-medium">
            {currentCity.name}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-3 rounded-2xl text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onAddClick}
          className="p-3 rounded-2xl text-white/80 hover:bg-white/10 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
