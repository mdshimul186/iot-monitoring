"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Bar, Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

export default function AgricultureSection({ data }: { data: HawkProData }) {
  const [agriculture, setAgriculture] = useState(data.agriculture);
  const [isLive, setIsLive] = useState(true);

  // Simulate live agricultural sensor updates every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAgriculture(prev => {
        // Update crop zones
        const newCropZones = prev.cropZones.map(zone => ({
          ...zone,
          moisture: Math.max(20, Math.min(90, zone.moisture + (Math.random() - 0.5) * 3)),
          ph: Math.max(5.5, Math.min(8.0, zone.ph + (Math.random() - 0.5) * 0.1)),
          status: zone.moisture > 50 ? 'Optimal' : 'Needs Attention'
        }));

        // Update soil moisture readings
        const newSoilMoisture = prev.soilMoisture.map(s => ({
          ...s,
          value: Math.max(15, Math.min(95, s.value + (Math.random() - 0.5) * 4))
        }));

        // Update pH history
        const newSoilPH = [...prev.soilPH];
        newSoilPH.shift();
        newSoilPH.push(Math.max(5.8, Math.min(7.8, prev.soilPH[prev.soilPH.length - 1] + (Math.random() - 0.5) * 0.15)));

        // Update EC
        const newEC = [...prev.electricalConductivity];
        newEC.shift();
        newEC.push(Math.max(0.5, Math.min(3.0, prev.electricalConductivity[prev.electricalConductivity.length - 1] + (Math.random() - 0.5) * 0.2)));

        return {
          ...prev,
          cropZones: newCropZones,
          soilMoisture: newSoilMoisture,
          soilPH: newSoilPH,
          electricalConductivity: newEC,
        };
      });
      setIsLive(false);
      setTimeout(() => setIsLive(true), 200);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const soilMoistureChart = {
    labels: agriculture.soilMoisture.map(s => `${s.zone} (${s.depth})`),
    datasets: [{
      label: 'Soil Moisture (%)',
      data: agriculture.soilMoisture.map(s => s.value),
      backgroundColor: agriculture.soilMoisture.map(s =>
        s.value < 30 ? 'rgba(239, 68, 68, 0.7)' :
          s.value < 50 ? 'rgba(234, 179, 8, 0.7)' :
            'rgba(34, 197, 94, 0.7)'
      ),
    }]
  };

  const soilPHChart = {
    labels: data.environmental.timeLabels,
    datasets: [{
      label: 'Soil pH',
      data: agriculture.soilPH,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const ecChart = {
    labels: data.environmental.timeLabels,
    datasets: [{
      label: 'EC (mS/cm)',
      data: agriculture.electricalConductivity,
      borderColor: 'rgb(14, 165, 233)',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const rainfallPulsesChart = {
    labels: data.environmental.timeLabels,
    datasets: [{
      label: 'Rainfall Pulses',
      data: agriculture.rainfallPulses,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750, easing: 'easeInOutQuart' as const },
    plugins: { legend: { position: 'top' as const } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-xl md:text-2xl">🌾</span>
            Agriculture & Field Sensors (AgTech)
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Crop & irrigation intelligence for precision farming</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
          <div className={`h-2 w-2 rounded-full bg-amber-500 ${isLive ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">LIVE AGTECH</span>
        </div>
      </div>

      {/* Irrigation Status Banner */}
      <div className={`rounded-2xl p-5 shadow-lg ${agriculture.irrigationStatus
        ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
        : 'bg-gradient-to-r from-slate-600 to-slate-700'
        } text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Irrigation System Status</div>
            <div className="mt-1 text-3xl font-bold">
              {agriculture.irrigationStatus ? 'ACTIVE' : 'STANDBY'}
            </div>
            <div className="mt-2 text-sm opacity-75">
              {agriculture.irrigationStatus ? 'Pump is currently running' : 'System ready for activation'}
            </div>
          </div>
          <div className="text-6xl">
            {agriculture.irrigationStatus ? '💧' : '⏸️'}
          </div>
        </div>
      </div>

      {/* Crop Zone Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agriculture.cropZones.map((zone, i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm">{zone.name}</div>
              <span className={`px-2 py-1 rounded-full text-xs ${zone.status === 'Optimal'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                }`}>
                {zone.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Moisture</span>
                <span className="font-bold transition-all duration-500">{zone.moisture.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${zone.moisture < 30 ? 'bg-red-500' :
                    zone.moisture < 50 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                  style={{ width: `${zone.moisture}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-slate-600 dark:text-slate-400">pH Level</span>
                <span className="font-bold transition-all duration-500">{zone.ph.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Soil Moisture by Zone/Depth */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Soil Moisture by Zone & Depth</div>
          <div className="h-64">
            <Bar data={soilMoistureChart} options={chartOptions} />
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Dry (&lt;30%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Moderate (30-50%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Optimal (&gt;50%)</span>
            </div>
          </div>
        </div>

        {/* Soil pH Trend */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Soil pH Trend (24h)</div>
          <div className="h-64">
            <Line data={soilPHChart} options={chartOptions} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Min</div>
              <div className="text-sm font-bold">{Math.min(...agriculture.soilPH).toFixed(2)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg</div>
              <div className="text-sm font-bold">{(agriculture.soilPH.reduce((a, b) => a + b) / agriculture.soilPH.length).toFixed(2)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Max</div>
              <div className="text-sm font-bold">{Math.max(...agriculture.soilPH).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Electrical Conductivity */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Electrical Conductivity (24h)</div>
          <div className="h-48">
            <Line data={ecChart} options={chartOptions} />
          </div>
          <div className="mt-3 text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
            <div className="text-xs text-cyan-600 dark:text-cyan-400">Average EC</div>
            <div className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
              {(agriculture.electricalConductivity.reduce((a, b) => a + b) / agriculture.electricalConductivity.length).toFixed(2)} mS/cm
            </div>
          </div>
        </div>

        {/* Rainfall Pulses */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Rainfall Event Detection (24h)</div>
          <div className="h-48">
            <Bar data={rainfallPulsesChart} options={chartOptions} />
          </div>
          <div className="mt-3 text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-xs text-blue-600 dark:text-blue-400">Total Pulses Detected</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {agriculture.rainfallPulses.reduce((a, b) => a + b, 0).toFixed(0)} events
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <div className="font-semibold text-amber-900 dark:text-amber-100">Smart Recommendations</div>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
              {agriculture.cropZones.some(z => z.moisture < 30) && (
                <li>• Consider activating irrigation for zones with low moisture (&lt;30%)</li>
              )}
              {agriculture.soilPH.some(ph => ph < 6.0 || ph > 7.5) && (
                <li>• Soil pH outside optimal range (6.0-7.5) - consider soil amendment</li>
              )}
              {(agriculture.soilPH.reduce((a, b) => a + b) / agriculture.soilPH.length) > 6.5 &&
                (agriculture.soilPH.reduce((a, b) => a + b) / agriculture.soilPH.length) < 7.2 && (
                  <li>• Soil conditions are optimal for most crops</li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

