'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 48,
    condition: 'Rainy',
    humidity: 88,
  });

  // In production, you could fetch real weather data
  useEffect(() => {
    // Optional: Fetch from weather API
    // For now, using static Bellingham-appropriate data
  }, []);

  return (
    <div className="bg-secondary text-white p-6 rounded shadow-lg border-t-4 border-primary">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-headline text-2xl font-bold italic">{weather.temp}°F</h4>
          <p className="text-[10px] uppercase opacity-70 tracking-widest font-black">
            Bellingham, WA
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{weather.condition}</p>
          <p className="text-[10px] opacity-70">Humidity: {weather.humidity}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-t border-white/10 pt-3">
          <p className="text-[9px] uppercase opacity-50 font-black">Gas Avg</p>
          <p className="text-xs font-bold">$4.12</p>
        </div>
        <div className="border-t border-white/10 pt-3 text-right">
          <p className="text-[9px] uppercase opacity-50 font-black">Tides</p>
          <p className="text-xs font-bold">High: 2:14PM</p>
        </div>
      </div>
    </div>
  );
}
