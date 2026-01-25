"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

export default function DeviceHealth({ data }: { data: HawkProData }) {
  const [deviceHealth, setDeviceHealth] = useState(data.deviceHealth);
  const [isLive, setIsLive] = useState(true);

  // Simulate live data updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceHealth(prev => ({
        ...prev,
        batteryVoltage: Math.max(3.4, Math.min(4.2, prev.batteryVoltage + (Math.random() - 0.5) * 0.05)),
        signalStrength: Math.round(Math.max(-120, Math.min(-60, prev.signalStrength + (Math.random() - 0.5) * 5))),
        internalTemp: Math.max(20, Math.min(60, prev.internalTemp + (Math.random() - 0.5) * 1)),
        memoryUsage: Math.round(Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 2))),
      }));
      setIsLive(false);
      setTimeout(() => setIsLive(true), 200);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const healthChart = {
    labels: deviceHealth.healthTimeline.map(h => h.time),
    datasets: [{
      label: 'Health Score',
      data: deviceHealth.healthTimeline.map(h => h.score),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const getBatteryColor = (voltage: number) => {
    if (voltage > 4.0) return 'text-emerald-600';
    if (voltage > 3.6) return 'text-blue-600';
    if (voltage > 3.4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getSignalQuality = (dbm: number) => {
    if (dbm > -80) return { label: 'Excellent', color: 'bg-emerald-500' };
    if (dbm > -90) return { label: 'Good', color: 'bg-blue-500' };
    if (dbm > -100) return { label: 'Fair', color: 'bg-amber-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const signal = getSignalQuality(deviceHealth.signalStrength);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            Device Health & Diagnostics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Ensure device reliability and performance monitoring</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
          <div className={`h-2 w-2 rounded-full bg-emerald-500 ${isLive ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">LIVE MONITORING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Power Status */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Power System</div>
            <div className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium">
              {deviceHealth.powerSource}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className={`text-3xl font-bold transition-all duration-500 ${getBatteryColor(deviceHealth.batteryVoltage)}`}>
                  {deviceHealth.batteryVoltage.toFixed(2)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">V</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Battery Voltage</div>
            </div>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((deviceHealth.batteryVoltage - 3.0) / 1.2) * 100)}%` }}
              ></div>
            </div>

            <div className="pt-2 border-t dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Min Voltage</div>
                <div className="font-semibold">3.0V</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Max Voltage</div>
                <div className="font-semibold">4.2V</div>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Strength */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Signal Strength</div>
            <div className={`px-2 py-1 rounded-lg ${signal.color}/10 ${signal.color.replace('bg-', 'text-')} text-xs font-medium`}>
              {signal.label}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-bold transition-all duration-500">{deviceHealth.signalStrength}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">dBm</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Network Signal</div>
            </div>

            {/* Signal bars visual */}
            <div className="flex items-end gap-1 h-16">
              {[1, 2, 3, 4, 5].map((bar) => {
                const threshold = -110 + (bar * 10);
                const isActive = deviceHealth.signalStrength > threshold;
                return (
                  <div
                    key={bar}
                    className={`flex-1 rounded-t transition-all ${isActive ? signal.color : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    style={{ height: `${bar * 20}%` }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Internal Temperature */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Internal Temp</div>
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${deviceHealth.internalTemp > 45
              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
              }`}>
              {deviceHealth.internalTemp > 45 ? 'High' : 'Normal'}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-bold transition-all duration-500">{deviceHealth.internalTemp.toFixed(1)}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">°C</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Enclosure Temperature</div>
            </div>

            {/* Temperature gauge */}
            <div className="relative h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full">
              <div
                className="absolute top-0 h-3 w-3 bg-white border-2 border-slate-900 rounded-full shadow-lg transition-all duration-500"
                style={{ left: `${Math.min(100, Math.max(0, ((deviceHealth.internalTemp - 20) / 40) * 100))}%`, transform: 'translateX(-50%)' }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>20°</span>
              <span>40°</span>
              <span>60°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Timeline & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Timeline Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">24-Hour Health Score Timeline</div>
          <div className="h-48">
            <Line data={healthChart} options={chartOptions} />
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">System Information</div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Firmware</span>
              <span className="font-medium font-mono">{deviceHealth.firmwareVersion}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Uptime</span>
              <span className="font-medium">{deviceHealth.uptime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Memory</span>
              <span className="font-medium">{deviceHealth.memoryUsage}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${deviceHealth.memoryUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${deviceHealth.memoryUsage}%` }}
              ></div>
            </div>
            <div className="pt-3 border-t dark:border-slate-700">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Last Reboot</div>
              <div className="text-sm font-medium">{deviceHealth.lastRebootReason}</div>
            </div>
            {deviceHealth.faultCodes.length > 0 && (
              <div className="pt-3 border-t dark:border-slate-700">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Fault Codes</div>
                {deviceHealth.faultCodes.map((code, i) => (
                  <div key={i} className="text-xs font-mono bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 px-2 py-1 rounded mb-1">
                    {code}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
