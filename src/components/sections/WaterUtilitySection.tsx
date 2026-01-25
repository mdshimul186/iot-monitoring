"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line, Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

export default function WaterUtilitySection({ data }: { data: HawkProData }) {
  const [waterUtility, setWaterUtility] = useState(data.waterUtility);
  const [isLive, setIsLive] = useState(true);

  // Simulate live water utility updates every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterUtility(prev => {
        // Update flow history
        const newFlowHistory = [...prev.flowHistory];
        newFlowHistory.shift();
        newFlowHistory.push(Math.max(0, Math.min(50, prev.flowRate + (Math.random() - 0.5) * 5)));

        return {
          ...prev,
          tankLevel: Math.max(0.5, Math.min(prev.tankCapacity - 0.1, prev.tankLevel + (Math.random() - 0.5) * 0.05)),
          flowRate: Math.max(0, Math.min(50, prev.flowRate + (Math.random() - 0.5) * 3)),
          pressure: Math.max(1.5, Math.min(4.5, prev.pressure + (Math.random() - 0.5) * 0.15)),
          turbidity: Math.max(0.5, Math.min(15, prev.turbidity + (Math.random() - 0.5) * 0.8)),
          tds: Math.round(Math.max(80, Math.min(300, prev.tds + (Math.random() - 0.5) * 10))),
          flowHistory: newFlowHistory,
        };
      });
      setIsLive(false);
      setTimeout(() => setIsLive(true), 200);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const fillPercentage = (waterUtility.tankLevel / waterUtility.tankCapacity) * 100;

  const flowChart = {
    labels: data.environmental.timeLabels,
    datasets: [{
      label: 'Flow Rate (L/min)',
      data: waterUtility.flowHistory,
      borderColor: 'rgb(14, 165, 233)',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const pumpChart = {
    labels: waterUtility.pumpHistory.map(p => p.time),
    datasets: [{
      label: 'Pump State',
      data: waterUtility.pumpHistory.map(p => p.state === 'ON' ? 1 : 0),
      backgroundColor: waterUtility.pumpHistory.map(p =>
        p.state === 'ON' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(148, 163, 184, 0.3)'
      ),
    }]
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">💧</span>
            Water & Utility Monitoring
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Resource usage & safety monitoring for utilities</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800">
          <div className={`h-2 w-2 rounded-full bg-cyan-500 ${isLive ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">LIVE WATER</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tank Level Visualization */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Water Tank Level</div>

          {/* Tank Visual */}
          <div className="relative h-64 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ height: `${fillPercentage}%` }}
            >
              <div className="absolute inset-0 opacity-20 animate-pulse bg-white"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <div className="text-4xl font-bold text-slate-900 dark:text-white drop-shadow-lg transition-all duration-500">
                  {waterUtility.tankLevel.toFixed(2)}m
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 drop-shadow transition-all duration-500">
                  {fillPercentage.toFixed(0)}% Full
                </div>
              </div>
            </div>
            {/* Level markers */}
            {[0, 25, 50, 75, 100].map(level => (
              <div
                key={level}
                className="absolute w-full border-t border-dashed border-slate-400 dark:border-slate-600"
                style={{ bottom: `${level}%` }}
              >
                <span className="absolute right-2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400">
                  {((level / 100) * waterUtility.tankCapacity).toFixed(1)}m
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Capacity</div>
              <div className="font-bold">{waterUtility.tankCapacity}m</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Volume</div>
              <div className="font-bold transition-all duration-500">{(waterUtility.tankLevel * 1000).toFixed(0)}L</div>
            </div>
          </div>
        </div>

        {/* Flow & Pressure Metrics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
              <div className="text-sm opacity-90">Flow Rate</div>
              <div className="mt-1 text-3xl font-bold transition-all duration-500">{waterUtility.flowRate.toFixed(1)}</div>
              <div className="mt-1 text-xs opacity-75">L/min</div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
              <div className="text-sm opacity-90">Pressure</div>
              <div className="mt-1 text-3xl font-bold transition-all duration-500">{waterUtility.pressure.toFixed(2)}</div>
              <div className="mt-1 text-xs opacity-75">bar</div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
              <div className="text-sm opacity-90">Turbidity</div>
              <div className="mt-1 text-3xl font-bold transition-all duration-500">{waterUtility.turbidity.toFixed(1)}</div>
              <div className="mt-1 text-xs opacity-75">NTU</div>
            </div>
          </div>

          {/* Flow Rate Chart */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-4">Flow Rate History (24h)</div>
            <div className="h-48">
              <Line
                data={flowChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 750, easing: 'easeInOutQuart' as const },
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pump History & Water Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pump ON/OFF History */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Pump Operation History</div>
          <div className="h-48">
            <Bar
              data={pumpChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                      callback: (value) => value === 1 ? 'ON' : 'OFF'
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  }
                }
              }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Pump ON</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-300 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Pump OFF</span>
            </div>
          </div>
        </div>

        {/* Water Quality & Leak Detection */}
        <div className="space-y-4">
          {/* Water Quality */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-3">Water Quality Parameters</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">TDS (Total Dissolved Solids)</span>
                <span className="font-bold transition-all duration-500">{waterUtility.tds.toFixed(0)} ppm</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${waterUtility.tds < 150 ? 'bg-emerald-500' :
                      waterUtility.tds < 250 ? 'bg-blue-500' :
                        'bg-amber-500'
                    }`}
                  style={{ width: `${Math.min(100, (waterUtility.tds / 300) * 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Turbidity</span>
                <span className="font-bold transition-all duration-500">{waterUtility.turbidity.toFixed(1)} NTU</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${waterUtility.turbidity < 5 ? 'bg-emerald-500' :
                      waterUtility.turbidity < 10 ? 'bg-amber-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(100, (waterUtility.turbidity / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Leak Detection */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-3">Leak Detection Events</div>
            {waterUtility.leakEvents.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-auto">
                {waterUtility.leakEvents.map((event, i) => (
                  <div key={i} className="p-2 rounded-lg border dark:border-slate-700 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-red-700 dark:text-red-300">{event.severity} Leak</span>
                      <span className="text-slate-600 dark:text-slate-400">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-emerald-600 dark:text-emerald-400">
                <div className="text-2xl mb-1">✓</div>
                <div className="text-sm">No leaks detected</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
