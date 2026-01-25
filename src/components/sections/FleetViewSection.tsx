"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" /> });

export default function FleetViewSection({ data }: { data: HawkProData }) {
  const { fleet } = data;
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const totalDevices = fleet.devices.length;
  const onlineDevices = fleet.devices.filter(d => d.status === 'online').length;
  const offlineDevices = totalDevices - onlineDevices;
  const avgBattery = fleet.devices.reduce((sum, d) => sum + d.battery, 0) / totalDevices;
  const avgSignal = fleet.devices.reduce((sum, d) => sum + d.signal, 0) / totalDevices;

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-emerald-500' : 'text-red-500';
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 70) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    if (battery > 30) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getSignalBars = (signal: number) => {
    if (signal > -80) return 5;
    if (signal > -90) return 4;
    if (signal > -100) return 3;
    if (signal > -110) return 2;
    return 1;
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          Multi-Device & Fleet View
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Scale operations and monitor entire device deployments</p>
      </div>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg">
          <div className="text-sm opacity-90">Total Devices</div>
          <div className="mt-1 text-4xl font-bold">{totalDevices}</div>
          <div className="mt-1 text-xs opacity-75">In Fleet</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg">
          <div className="text-sm opacity-90">Online</div>
          <div className="mt-1 text-4xl font-bold">{onlineDevices}</div>
          <div className="mt-1 text-xs opacity-75">{((onlineDevices / totalDevices) * 100).toFixed(0)}% Uptime</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-5 text-white shadow-lg">
          <div className="text-sm opacity-90">Offline</div>
          <div className="mt-1 text-4xl font-bold">{offlineDevices}</div>
          <div className="mt-1 text-xs opacity-75">Requires attention</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 text-white shadow-lg">
          <div className="text-sm opacity-90">Avg Battery</div>
          <div className="mt-1 text-4xl font-bold">{avgBattery.toFixed(0)}%</div>
          <div className="mt-1 text-xs opacity-75">Fleet Average</div>
        </div>
      </div>

      {/* Regional Summary */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Region-wise Summary</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fleet.regionalSummary.map((region, i) => (
            <div key={i} className="p-4 rounded-xl border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{region.region}</div>
                <div className="text-2xl font-bold">{region.online + region.offline}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">● Online</span>
                  <span className="font-bold">{region.online}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600 dark:text-red-400">● Offline</span>
                  <span className="font-bold">{region.offline}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(region.online / (region.online + region.offline)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            📊 Table View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            🗺️ Map View
          </button>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
            Bulk Actions
          </button>
          <button className="px-4 py-2 rounded-lg border dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            Export Data
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="text-left py-3 px-5">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-5">Device ID</th>
                  <th className="text-left py-3 px-5">Name</th>
                  <th className="text-left py-3 px-5">Status</th>
                  <th className="text-left py-3 px-5">Battery</th>
                  <th className="text-left py-3 px-5">Signal</th>
                  <th className="text-left py-3 px-5">Location</th>
                  <th className="text-left py-3 px-5">Last Seen</th>
                  <th className="text-left py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {fleet.devices.map((device) => (
                  <tr
                    key={device.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedDevice === device.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    <td className="py-3 px-5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-3 px-5 font-mono text-xs font-bold">{device.id}</td>
                    <td className="py-3 px-5 font-medium">{device.name}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={getStatusColor(device.status)}>{device.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-16">
                          <div
                            className={`h-full rounded-full ${device.battery > 70 ? 'bg-emerald-500' :
                                device.battery > 30 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${device.battery}%` }}
                          ></div>
                        </div>
                        <span className="font-bold w-10 text-right">{device.battery}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 rounded-full ${bar <= getSignalBars(device.signal)
                                ? 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            style={{ height: `${bar * 3}px` }}
                          ></div>
                        ))}
                        <span className="ml-1 text-xs font-mono">{device.signal}dBm</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-mono text-xs">
                      {device.location.lat.toFixed(3)}, {device.location.lng.toFixed(3)}
                    </td>
                    <td className="py-3 px-5 text-xs text-slate-500 dark:text-slate-400">{device.lastSeen}</td>
                    <td className="py-3 px-5">
                      <button className="px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Fleet Location Map</div>
          <div className="h-96 w-full rounded-xl border dark:border-slate-700 overflow-hidden relative">
            <MapComponent
              lat={fleet.devices[0].location.lat}
              lng={fleet.devices[0].location.lng}
            />
            {/* Device markers overlay */}
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 rounded-lg p-3 shadow-lg border dark:border-slate-700">
              <div className="text-xs font-semibold mb-2">Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  <span>Online ({onlineDevices})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>Offline ({offlineDevices})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Comparison Heatmap */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Fleet Health Heatmap</div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {fleet.devices.map((device) => {
            const healthScore = (device.battery + ((device.signal + 120) / 50 * 100)) / 2;
            return (
              <div
                key={device.id}
                className={`aspect-square rounded-lg relative group cursor-pointer transition-transform hover:scale-110 ${healthScore > 75 ? 'bg-emerald-500' :
                    healthScore > 50 ? 'bg-amber-500' :
                      healthScore > 25 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                title={`${device.name}: ${healthScore.toFixed(0)}%`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[8px] font-bold">{device.id.split('-')[1]}</div>
                  <div className="text-xs font-bold">{healthScore.toFixed(0)}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>Critical</span>
          <span>Healthy</span>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Bulk Device Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            🔄 Restart All
          </button>
          <button className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            📥 Force Sync
          </button>
          <button className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            🔧 Update Firmware
          </button>
          <button className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            💾 Backup Configs
          </button>
        </div>
      </div>
    </section>
  );
}
