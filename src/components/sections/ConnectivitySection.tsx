"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line, Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

export default function ConnectivitySection({ data }: { data: HawkProData }) {
  const [connectivity, setConnectivity] = useState(data.connectivity);
  const [isLive, setIsLive] = useState(true);

  // Simulate live network updates every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectivity(prev => {
        // Update the last values in the arrays
        const newSignalHistory = [...prev.signalHistory];
        const newPacketSuccess = [...prev.packetSuccess];
        const newDataUsageUp = [...prev.dataUsageUp];
        const newDataUsageDown = [...prev.dataUsageDown];

        // Shift arrays and add new values (keep last 12 points)
        newSignalHistory.shift();
        newSignalHistory.push(Math.round(Math.max(-120, Math.min(-60, prev.signalHistory[prev.signalHistory.length - 1] + (Math.random() - 0.5) * 10))));

        newPacketSuccess.shift();
        newPacketSuccess.push(Math.round(Math.max(85, Math.min(100, prev.packetSuccess[prev.packetSuccess.length - 1] + (Math.random() - 0.5) * 5))));

        newDataUsageUp.shift();
        newDataUsageUp.push(Math.max(0, prev.dataUsageUp[prev.dataUsageUp.length - 1] + (Math.random() - 0.3) * 0.5));

        newDataUsageDown.shift();
        newDataUsageDown.push(Math.max(0, prev.dataUsageDown[prev.dataUsageDown.length - 1] + (Math.random() - 0.3) * 0.8));

        return {
          ...prev,
          signalHistory: newSignalHistory,
          packetSuccess: newPacketSuccess,
          dataUsageUp: newDataUsageUp,
          dataUsageDown: newDataUsageDown,
        };
      });
      setIsLive(false);
      setTimeout(() => setIsLive(true), 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const signalChart = {
    labels: connectivity.timeLabels,
    datasets: [{
      label: 'Signal Strength (dBm)',
      data: connectivity.signalHistory,
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const dataUsageChart = {
    labels: connectivity.timeLabels,
    datasets: [
      {
        label: 'Upload (MB)',
        data: connectivity.dataUsageUp,
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      },
      {
        label: 'Download (MB)',
        data: connectivity.dataUsageDown,
        backgroundColor: 'rgba(34, 197, 94, 0.7)'
      }
    ]
  };

  const successRateChart = {
    labels: connectivity.timeLabels,
    datasets: [{
      label: 'Success Rate (%)',
      data: connectivity.packetSuccess,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.3
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
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  const totalUpload = connectivity.dataUsageUp.reduce((a, b) => a + b, 0);
  const totalDownload = connectivity.dataUsageDown.reduce((a, b) => a + b, 0);
  const avgSuccess = (connectivity.packetSuccess.reduce((a, b) => a + b, 0) / connectivity.packetSuccess.length).toFixed(1);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-xl md:text-2xl">📡</span>
            Connectivity & Network Performance
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Network reliability and data transmission analytics</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
          <div className={`h-2 w-2 rounded-full bg-purple-500 ${isLive ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">LIVE NETWORK</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Network</div>
          <div className="mt-1 text-2xl font-bold">{connectivity.networkType}</div>
          <div className="mt-1 text-xs opacity-75">{connectivity.carrier}</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Data Upload</div>
          <div className="mt-1 text-2xl font-bold transition-all duration-500">{totalUpload.toFixed(1)}</div>
          <div className="mt-1 text-xs opacity-75">MB (24h)</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Success Rate</div>
          <div className="mt-1 text-2xl font-bold transition-all duration-500">{avgSuccess}%</div>
          <div className="mt-1 text-xs opacity-75">Uplink Quality</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="text-sm opacity-90">Offline Events</div>
          <div className="mt-1 text-2xl font-bold">{connectivity.offlineDuration.length}</div>
          <div className="mt-1 text-xs opacity-75">Last 48h</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signal History */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Signal Strength History (24h)</div>
          <div className="h-56">
            <Line data={signalChart} options={chartOptions} />
          </div>
        </div>

        {/* Data Usage */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Data Usage (24h)</div>
          <div className="h-56">
            <Bar data={dataUsageChart} options={chartOptions} />
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Packet Success Rate (24h)</div>
          <div className="h-56">
            <Line data={successRateChart} options={chartOptions} />
          </div>
        </div>

        {/* Offline Duration Log */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Offline Duration Log</div>
          {connectivity.offlineDuration.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-auto">
              {connectivity.offlineDuration.map((event, i) => (
                <div key={i} className="rounded-lg border dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Offline Period</span>
                    <span className="text-xs font-bold text-red-700 dark:text-red-300">{event.duration} min</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <div>Start: {event.start}</div>
                    <div>End: {event.end}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-56 text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">✓</div>
                <div className="text-sm">No offline periods detected</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Network Summary Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Network Summary</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg Signal</div>
            <div className="mt-1 text-lg font-bold transition-all duration-500">
              {(connectivity.signalHistory.reduce((a, b) => a + b, 0) / connectivity.signalHistory.length).toFixed(0)} dBm
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Data</div>
            <div className="mt-1 text-lg font-bold transition-all duration-500">{(totalUpload + totalDownload).toFixed(1)} MB</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Uptime</div>
            <div className="mt-1 text-lg font-bold">{(((24 * 60 - connectivity.offlineDuration.reduce((a, b) => a + b.duration, 0)) / (24 * 60)) * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Connection Quality</div>
            <div className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400 transition-all duration-500">
              {Number(avgSuccess) > 95 ? 'Excellent' : Number(avgSuccess) > 85 ? 'Good' : 'Fair'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
