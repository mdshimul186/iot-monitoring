"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

export default function EnvironmentalSection({ data }: { data: HawkProData }) {
  const [environmental, setEnvironmental] = useState(data.environmental);
  const [isLive, setIsLive] = useState(true);

  // Simulate live environmental sensor updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironmental(prev => {
        // Update the last values in the arrays
        const newAmbientTemp = [...prev.ambientTemp];
        const newHumidity = [...prev.humidity];
        const newPressure = [...prev.pressure];
        const newAirQuality = [...prev.airQuality];
        const newSoilTemp = [...prev.soilTemp];
        const newRainfall = [...prev.rainfall];

        // Shift arrays and add new values (keep last 12 points)
        newAmbientTemp.shift();
        newAmbientTemp.push(Math.max(15, Math.min(40, prev.ambientTemp[prev.ambientTemp.length - 1] + (Math.random() - 0.5) * 2)));

        newHumidity.shift();
        newHumidity.push(Math.max(30, Math.min(90, prev.humidity[prev.humidity.length - 1] + (Math.random() - 0.5) * 5)));

        newPressure.shift();
        newPressure.push(Math.max(980, Math.min(1030, prev.pressure[prev.pressure.length - 1] + (Math.random() - 0.5) * 3)));

        newAirQuality.shift();
        newAirQuality.push(Math.round(Math.max(20, Math.min(150, prev.airQuality[prev.airQuality.length - 1] + (Math.random() - 0.5) * 8))));

        newSoilTemp.shift();
        newSoilTemp.push(Math.max(12, Math.min(35, prev.soilTemp[prev.soilTemp.length - 1] + (Math.random() - 0.5) * 1.5)));

        newRainfall.shift();
        newRainfall.push(Math.max(0, prev.rainfall[prev.rainfall.length - 1] + (Math.random() - 0.8) * 0.5));

        return {
          ...prev,
          ambientTemp: newAmbientTemp,
          humidity: newHumidity,
          pressure: newPressure,
          airQuality: newAirQuality,
          soilTemp: newSoilTemp,
          rainfall: newRainfall,
        };
      });
      setIsLive(false);
      setTimeout(() => setIsLive(true), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const environmentalChart = {
    labels: environmental.timeLabels,
    datasets: [
      {
        label: 'Ambient Temp (°C)',
        data: environmental.ambientTemp,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: environmental.humidity,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
      }
    ]
  };

  const pressureChart = {
    labels: environmental.timeLabels,
    datasets: [{
      label: 'Pressure (hPa)',
      data: environmental.pressure,
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const rainfallChart = {
    labels: environmental.timeLabels,
    datasets: [{
      label: 'Rainfall (mm)',
      data: environmental.rainfall,
      backgroundColor: 'rgba(14, 165, 233, 0.7)',
    }]
  };

  const airQualityChart = {
    labels: environmental.timeLabels,
    datasets: [{
      label: 'AQI',
      data: environmental.airQuality,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const
    },
    plugins: { legend: { position: 'top' as const } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  const dualAxisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const
    },
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: { type: 'linear' as const, position: 'left' as const, title: { display: true, text: 'Temperature (°C)' } },
      y1: { type: 'linear' as const, position: 'right' as const, title: { display: true, text: 'Humidity (%)' }, grid: { drawOnChartArea: false } }
    }
  };

  const currentTemp = environmental.ambientTemp[environmental.ambientTemp.length - 1];
  const currentHumidity = environmental.humidity[environmental.humidity.length - 1];
  const currentPressure = environmental.pressure[environmental.pressure.length - 1];
  const currentAQI = environmental.airQuality[environmental.airQuality.length - 1];

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-emerald-500' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'bg-orange-500' };
    return { label: 'Unhealthy', color: 'bg-red-500' };
  };

  const aqiStatus = getAQIStatus(currentAQI);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-xl md:text-2xl">🌡️</span>
            Environmental Monitoring
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Core sensor intelligence for environmental compliance</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <div className={`h-2 w-2 rounded-full bg-green-500 ${isLive ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs font-semibold text-green-700 dark:text-green-300">LIVE SENSORS</span>
        </div>
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Temperature</div>
          <div className="mt-1 text-3xl font-bold transition-all duration-500">{currentTemp.toFixed(1)}°C</div>
          <div className="mt-1 text-xs opacity-75">Ambient</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Humidity</div>
          <div className="mt-1 text-3xl font-bold transition-all duration-500">{currentHumidity.toFixed(0)}%</div>
          <div className="mt-1 text-xs opacity-75">Relative</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Pressure</div>
          <div className="mt-1 text-3xl font-bold transition-all duration-500">{currentPressure.toFixed(0)}</div>
          <div className="mt-1 text-xs opacity-75">hPa</div>
        </div>

        <div className={`rounded-xl bg-gradient-to-br ${aqiStatus.color} to-green-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all`}>
          <div className="text-sm opacity-90">Air Quality</div>
          <div className="mt-1 text-3xl font-bold transition-all duration-500">{currentAQI.toFixed(0)}</div>
          <div className="mt-1 text-xs opacity-75">{aqiStatus.label}</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Temperature & Humidity */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Temperature & Humidity (24h)</div>
            <div className="flex gap-2">
              <div className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs">
                Threshold: {environmental.thresholds.min}-{environmental.thresholds.max}°C
              </div>
            </div>
          </div>
          <div className="h-64">
            <Line data={environmentalChart} options={dualAxisOptions} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg Temp</div>
              <div className="text-lg font-bold transition-all duration-500">{(environmental.ambientTemp.reduce((a, b) => a + b) / environmental.ambientTemp.length).toFixed(1)}°C</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg Humidity</div>
              <div className="text-lg font-bold transition-all duration-500">{(environmental.humidity.reduce((a, b) => a + b) / environmental.humidity.length).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Atmospheric Pressure (24h)</div>
          <div className="h-64">
            <Line data={pressureChart} options={chartOptions} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Min</div>
              <div className="text-sm font-bold">{Math.min(...environmental.pressure).toFixed(0)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Max</div>
              <div className="text-sm font-bold">{Math.max(...environmental.pressure).toFixed(0)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg</div>
              <div className="text-sm font-bold transition-all duration-500">{(environmental.pressure.reduce((a, b) => a + b) / environmental.pressure.length).toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Rainfall */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Rainfall Distribution (24h)</div>
          <div className="h-64">
            <Line data={rainfallChart} options={chartOptions} />
          </div>
          <div className="mt-3 text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-xs text-blue-600 dark:text-blue-400">Total Rainfall</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 transition-all duration-500">
              {environmental.rainfall.reduce((a, b) => a + b, 0).toFixed(1)} mm
            </div>
          </div>
        </div>

        {/* Air Quality Index */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Air Quality Index (24h)</div>
          <div className="h-64">
            <Line data={airQualityChart} options={chartOptions} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1">
            <div className="text-center p-2 rounded bg-emerald-100 dark:bg-emerald-900/30">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300">Good</div>
              <div className="text-xs font-bold">0-50</div>
            </div>
            <div className="text-center p-2 rounded bg-yellow-100 dark:bg-yellow-900/30">
              <div className="text-[10px] text-yellow-700 dark:text-yellow-300">Moderate</div>
              <div className="text-xs font-bold">51-100</div>
            </div>
            <div className="text-center p-2 rounded bg-orange-100 dark:bg-orange-900/30">
              <div className="text-[10px] text-orange-700 dark:text-orange-300">Unhealthy</div>
              <div className="text-xs font-bold">101-150</div>
            </div>
            <div className="text-center p-2 rounded bg-red-100 dark:bg-red-900/30">
              <div className="text-[10px] text-red-700 dark:text-red-300">Very</div>
              <div className="text-xs font-bold">151+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Temperature */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Soil Temperature (24h)</div>
        <div className="h-48">
          <Line
            data={{
              labels: environmental.timeLabels,
              datasets: [{
                label: 'Soil Temp (°C)',
                data: environmental.soilTemp,
                borderColor: 'rgb(120, 53, 15)',
                backgroundColor: 'rgba(120, 53, 15, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </section>
  );
}
