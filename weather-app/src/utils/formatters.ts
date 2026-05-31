export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatTemperatureRange = (min: number, max: number): string => {
  return `${Math.round(min)}° / ${Math.round(max)}°`;
};

export const formatHour = (time: string): string => {
  const date = new Date(time);
  const hours = date.getHours();
  if (hours === 0) return '凌晨';
  if (hours < 6) return '凌晨';
  if (hours === 6) return '早上';
  if (hours < 12) return '上午';
  if (hours === 12) return '中午';
  if (hours < 18) return '下午';
  if (hours === 18) return '傍晚';
  return '晚上';
};

export const formatHourShort = (time: string): string => {
  const date = new Date(time);
  return `${date.getHours()}:00`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return '今天';
  if (date.toDateString() === tomorrow.toDateString()) return '明天';

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
};

export const formatDateFull = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekdays[date.getDay()]}`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} km/h`;
};

export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
