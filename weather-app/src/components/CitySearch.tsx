import React, { useState, useCallback } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';
import { City } from '../types/weather';
import { useWeatherStore } from '../store/weatherStore';
import { debounce } from '../utils/formatters';

interface CitySearchProps {
  onClose: () => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const { searchResults, searchLoading, searchCity, clearSearchResults, addCity, setCurrentCity } = useWeatherStore();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchCity(value);
    }, 300),
    [searchCity]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      clearSearchResults();
    }
  };

  const handleSelectCity = (city: City) => {
    addCity(city);
    setCurrentCity(city);
    setQuery('');
    clearSearchResults();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="w-full max-w-md">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="搜索城市..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {searchLoading && (
            <div className="text-center py-8 text-white/60">
              <div className="animate-pulse">搜索中...</div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
                >
                  <MapPin className="w-5 h-5 text-white/50 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-white/60">
                      {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && searchResults.length === 0 && !searchLoading && (
            <div className="text-center py-8 text-white/60">
              未找到城市 "{query}"
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default CitySearch;
