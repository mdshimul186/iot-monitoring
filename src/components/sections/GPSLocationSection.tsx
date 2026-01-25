"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" /> });

export default function GPSLocationSection({ data }: { data: HawkProData }) {
  const { gps } = data;

  const avgSpeed = gps.movementHistory.reduce((sum, m) => sum + m.speed, 0) / gps.movementHistory.length;
  const maxSpeed = Math.max(...gps.movementHistory.map(m => m.speed));
  const totalDistance = gps.movementHistory.length * 0.5; // Approximate

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">📍</span>
          GPS, Location & Asset Tracking
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Asset visibility, security, and movement analytics</p>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Current Speed</div>
          <div className="mt-1 text-3xl font-bold">{gps.speed.toFixed(1)}</div>
          <div className="mt-1 text-xs opacity-75">km/h</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">GPS Accuracy</div>
          <div className="mt-1 text-3xl font-bold">{gps.accuracy.toFixed(1)}</div>
          <div className="mt-1 text-xs opacity-75">meters (CEP)</div>
        </div>

        <div className={`rounded-xl bg-gradient-to-br p-4 text-white shadow-lg ${gps.geofenceStatus === 'Inside'
          ? 'from-green-500 to-emerald-600'
          : 'from-red-500 to-orange-600'
          }`}>
          <div className="text-sm opacity-90">Geofence</div>
          <div className="mt-1 text-2xl font-bold">{gps.geofenceStatus}</div>
          <div className="mt-1 text-xs opacity-75">Boundary Status</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white shadow-lg">
          <div className="text-sm opacity-90">Tamper Events</div>
          <div className="mt-1 text-3xl font-bold">{gps.tamperEvents.length}</div>
          <div className="mt-1 text-xs opacity-75">Last 24h</div>
        </div>
      </div>

      {/* Main Map & Movement Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Map */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Live GPS Location</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 dark:text-slate-400">Live Tracking</span>
            </div>
          </div>

          <div className="h-96 w-full rounded-xl border dark:border-slate-700 overflow-hidden relative">
            <MapComponent lat={gps.currentLat} lng={gps.currentLng} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Latitude</div>
              <div className="text-sm font-mono font-bold">{gps.currentLat.toFixed(6)}°</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Longitude</div>
              <div className="text-sm font-mono font-bold">{gps.currentLng.toFixed(6)}°</div>
            </div>
          </div>
        </div>

        {/* Movement Statistics */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-3">Movement Status</div>
            <div className="flex items-center justify-center h-24">
              <div className={`text-center ${gps.speed > 5 ? 'animate-pulse' : ''}`}>
                <div className="text-5xl mb-2">{gps.speed > 5 ? '🚗' : '🅿️'}</div>
                <div className="text-sm font-semibold">
                  {gps.speed > 5 ? 'Moving' : 'Stationary'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-3">Trip Statistics</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Avg Speed</span>
                <span className="font-bold">{avgSpeed.toFixed(1)} km/h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Max Speed</span>
                <span className="font-bold">{maxSpeed.toFixed(1)} km/h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Distance</span>
                <span className="font-bold">{totalDistance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Data Points</span>
                <span className="font-bold">{gps.movementHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Geofence Indicator */}
          <div className={`rounded-2xl p-5 shadow-lg ${gps.geofenceStatus === 'Inside'
            ? 'bg-gradient-to-br from-emerald-500 to-green-600'
            : 'bg-gradient-to-br from-red-500 to-orange-600'
            } text-white`}>
            <div className="text-sm opacity-90">Geofence Status</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{gps.geofenceStatus}</div>
                <div className="text-xs opacity-75 mt-1">
                  {gps.geofenceStatus === 'Inside' ? 'Within authorized area' : 'Boundary breach detected'}
                </div>
              </div>
              <div className="text-4xl">{gps.geofenceStatus === 'Inside' ? '✓' : '⚠️'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Movement History Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Movement History (Last 15 Positions)</div>
          <button className="px-3 py-1.5 rounded-lg border dark:border-slate-700 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
            Export GPX
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="text-left py-2 pr-4">Time</th>
                <th className="text-left py-2 pr-4">Latitude</th>
                <th className="text-left py-2 pr-4">Longitude</th>
                <th className="text-left py-2 pr-4">Speed (km/h)</th>
                <th className="text-left py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {gps.movementHistory.map((point, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="py-2 pr-4 whitespace-nowrap">{point.time}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{point.lat.toFixed(6)}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{point.lng.toFixed(6)}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${point.speed > 40 ? 'bg-red-500' :
                            point.speed > 20 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                          style={{ width: `${Math.min(100, (point.speed / 60) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold w-12 text-right">{point.speed.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${point.speed > 5
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                      {point.speed > 5 ? 'Moving' : 'Stopped'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tamper/Security Events */}
      {gps.tamperEvents.length > 0 && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <div className="font-semibold text-red-900 dark:text-red-100 mb-2">Security & Tamper Events</div>
              <div className="space-y-2">
                {gps.tamperEvents.map((event, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-700 dark:text-red-300">{event.type}</span>
                      <span className="text-xs text-red-600 dark:text-red-400">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
