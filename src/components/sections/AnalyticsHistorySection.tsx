"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line } from 'react-chartjs-2';

export default function AnalyticsHistorySection({ data }: { data: HawkProData }) {
  const { analytics } = data;

  // Long-term trends chart
  const trendsChart = {
    labels: analytics.longTermTrends.map(t => t.date),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: analytics.longTermTrends.map(t => t.avgTemp),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: analytics.longTermTrends.map(t => t.avgHumidity),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
      },
      {
        label: 'Soil Moisture (%)',
        data: analytics.longTermTrends.map(t => t.avgSoil),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y1',
      }
    ]
  };

  // Create heatmap data
  const heatmapData = analytics.longTermTrends.map((trend, i) => ({
    day: trend.date,
    temp: trend.avgTemp,
    humidity: trend.avgHumidity,
    soil: trend.avgSoil
  }));

  const getHeatmapColor = (value: number, type: 'temp' | 'humidity' | 'soil') => {
    if (type === 'temp') {
      if (value < 20) return 'bg-blue-500';
      if (value < 25) return 'bg-cyan-500';
      if (value < 30) return 'bg-emerald-500';
      if (value < 35) return 'bg-amber-500';
      return 'bg-red-500';
    } else if (type === 'humidity' || type === 'soil') {
      if (value < 30) return 'bg-red-500';
      if (value < 50) return 'bg-amber-500';
      if (value < 70) return 'bg-emerald-500';
      return 'bg-blue-500';
    }
    return 'bg-slate-500';
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Historical Data & Analytics
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Insights, forecasting, and long-term trend analysis</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Data Points</div>
          <div className="mt-1 text-3xl font-bold">30</div>
          <div className="mt-1 text-xs opacity-75">Days of History</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Anomalies</div>
          <div className="mt-1 text-3xl font-bold">{analytics.anomalies.length}</div>
          <div className="mt-1 text-xs opacity-75">Detected Events</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Correlations</div>
          <div className="mt-1 text-3xl font-bold">{analytics.correlations.length}</div>
          <div className="mt-1 text-xs opacity-75">Key Relationships</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Forecast</div>
          <div className="mt-1 text-3xl font-bold">7</div>
          <div className="mt-1 text-xs opacity-75">Days Ahead</div>
        </div>
      </div>

      {/* Long-term Trends - Multi-layer Graph */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Long-term Trends (30 Days)</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border dark:border-slate-700 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
              Export CSV
            </button>
            <button className="px-3 py-1.5 rounded-lg border dark:border-slate-700 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
              Export PDF
            </button>
          </div>
        </div>
        <div className="h-80">
          <Line
            data={trendsChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              plugins: {
                legend: { position: 'top' as const },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed.y;
                      if (value === null || value === undefined) {
                        return `${context.dataset.label}: N/A`;
                      }
                      return `${context.dataset.label}: ${value.toFixed(1)}`;
                    }
                  }
                }
              },
              scales: {
                x: { grid: { display: false } },
                y: {
                  type: 'linear' as const,
                  position: 'left' as const,
                  title: { display: true, text: 'Temperature (°C)' },
                  grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y1: {
                  type: 'linear' as const,
                  position: 'right' as const,
                  title: { display: true, text: 'Humidity / Soil (%)' },
                  grid: { drawOnChartArea: false }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Heatmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Temperature Heatmap */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-3">Temperature Heatmap</div>
          <div className="grid grid-cols-7 gap-1">
            {heatmapData.slice(0, 28).map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded ${getHeatmapColor(day.temp, 'temp')} relative group cursor-pointer transition-transform hover:scale-110`}
                title={`${day.day}: ${day.temp.toFixed(1)}°C`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold opacity-0 group-hover:opacity-100">
                  {day.temp.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Cold</span>
            <span>Hot</span>
          </div>
        </div>

        {/* Humidity Heatmap */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-3">Humidity Heatmap</div>
          <div className="grid grid-cols-7 gap-1">
            {heatmapData.slice(0, 28).map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded ${getHeatmapColor(day.humidity, 'humidity')} relative group cursor-pointer transition-transform hover:scale-110`}
                title={`${day.day}: ${day.humidity.toFixed(1)}%`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold opacity-0 group-hover:opacity-100">
                  {day.humidity.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Dry</span>
            <span>Humid</span>
          </div>
        </div>

        {/* Soil Moisture Heatmap */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-3">Soil Moisture Heatmap</div>
          <div className="grid grid-cols-7 gap-1">
            {heatmapData.slice(0, 28).map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded ${getHeatmapColor(day.soil, 'soil')} relative group cursor-pointer transition-transform hover:scale-110`}
                title={`${day.day}: ${day.soil.toFixed(1)}%`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold opacity-0 group-hover:opacity-100">
                  {day.soil.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Dry</span>
            <span>Wet</span>
          </div>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Correlation Analysis</div>
        <div className="space-y-3">
          {analytics.correlations.map((corr, i) => {
            const absCorr = Math.abs(corr.correlation);
            const isPositive = corr.correlation > 0;
            const strength = absCorr > 0.7 ? 'Strong' : absCorr > 0.4 ? 'Moderate' : 'Weak';

            return (
              <div key={i} className="p-4 rounded-xl border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{corr.metric1} ↔ {corr.metric2}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${absCorr > 0.7
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                    : absCorr > 0.4
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                    {strength} {isPositive ? 'Positive' : 'Negative'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${absCorr * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold w-16 text-right">{corr.correlation.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {isPositive
                    ? `When ${corr.metric1} increases, ${corr.metric2} tends to increase`
                    : `When ${corr.metric1} increases, ${corr.metric2} tends to decrease`
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly Detection */}
      {analytics.anomalies.length > 0 && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <div className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Anomaly Detection</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analytics.anomalies.map((anomaly, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{anomaly.metric}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400">{anomaly.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Actual: {anomaly.value.toFixed(1)}</span>
                      <span className="text-slate-600 dark:text-slate-400">Expected: {anomaly.expected.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Patterns Info */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">📊</div>
          <div className="flex-1">
            <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Seasonal Pattern Insights</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Temperature Pattern</div>
                <div className="font-medium">Consistent daily cycle detected</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Humidity Pattern</div>
                <div className="font-medium">Inverse correlation with temperature</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Soil Moisture Pattern</div>
                <div className="font-medium">Gradual depletion trend</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
