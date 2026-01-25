"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { useState } from 'react';

export default function ConfigurationSection({ data }: { data: HawkProData }) {
  const { configuration } = data;
  const [selectedProfile, setSelectedProfile] = useState(configuration.powerProfile);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">🛠️</span>
          Configuration & Device Control
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Remote management and device configuration</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg hover:scale-105 transition-transform text-left">
          <div className="text-3xl mb-2">🔄</div>
          <div className="font-semibold">Restart Device</div>
          <div className="text-xs opacity-75 mt-1">Immediate reboot</div>
        </button>

        <button className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg hover:scale-105 transition-transform text-left">
          <div className="text-3xl mb-2">📥</div>
          <div className="font-semibold">Force Sync</div>
          <div className="text-xs opacity-75 mt-1">Upload data now</div>
        </button>

        <button className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 text-white shadow-lg hover:scale-105 transition-transform text-left">
          <div className="text-3xl mb-2">🔌</div>
          <div className="font-semibold">Reset I/O</div>
          <div className="text-xs opacity-75 mt-1">Reinitialize sensors</div>
        </button>

        <button className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg hover:scale-105 transition-transform text-left">
          <div className="text-3xl mb-2">💾</div>
          <div className="font-semibold">Backup Config</div>
          <div className="text-xs opacity-75 mt-1">Save settings</div>
        </button>
      </div>

      {/* Configuration Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sampling & Upload Settings */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Sampling & Upload Configuration</div>

          <div className="space-y-4">
            {/* Sampling Rate */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Sampling Rate
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="1min" selected={configuration.samplingRate === '1 min'}>Every 1 minute</option>
                <option value="5min" selected={configuration.samplingRate === '5 min'}>Every 5 minutes</option>
                <option value="10min" selected={configuration.samplingRate === '10 min'}>Every 10 minutes</option>
                <option value="30min" selected={configuration.samplingRate === '30 min'}>Every 30 minutes</option>
                <option value="1hour">Every 1 hour</option>
              </select>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Current: <span className="font-semibold">{configuration.samplingRate}</span>
              </div>
            </div>

            {/* Upload Interval */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Upload Interval
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="5min" selected={configuration.uploadInterval === '5 min'}>Every 5 minutes</option>
                <option value="15min" selected={configuration.uploadInterval === '15 min'}>Every 15 minutes</option>
                <option value="30min" selected={configuration.uploadInterval === '30 min'}>Every 30 minutes</option>
                <option value="1hour" selected={configuration.uploadInterval === '1 hour'}>Every 1 hour</option>
              </select>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Current: <span className="font-semibold">{configuration.uploadInterval}</span>
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Apply Changes
            </button>
          </div>
        </div>

        {/* Power Profile Settings */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Power Profile Settings</div>

          <div className="space-y-3">
            {['Low Power', 'Balanced', 'High Performance'].map((profile) => (
              <div
                key={profile}
                onClick={() => setSelectedProfile(profile)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedProfile === profile
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{profile}</div>
                  <div className={`h-5 w-5 rounded-full border-2 ${selectedProfile === profile
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-300 dark:border-slate-600'
                    }`}>
                    {selectedProfile === profile && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {profile === 'Low Power' && 'Extended battery life, reduced sampling'}
                  {profile === 'Balanced' && 'Optimal balance of performance and efficiency'}
                  {profile === 'High Performance' && 'Maximum sampling rate, high power usage'}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Update Power Profile
          </button>
        </div>
      </div>

      {/* Sensor Calibration */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="font-semibold mb-4">Sensor Calibration</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="text-left py-3 pr-4">Sensor</th>
                <th className="text-left py-3 pr-4">Offset</th>
                <th className="text-left py-3 pr-4">Scale Factor</th>
                <th className="text-left py-3 pr-4">Last Calibrated</th>
                <th className="text-left py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {configuration.sensorCalibration.map((sensor, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="py-3 pr-4 font-medium">{sensor.sensor}</td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      value={sensor.offset.toFixed(2)}
                      className="w-24 px-2 py-1 rounded border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      value={sensor.scale.toFixed(3)}
                      className="w-24 px-2 py-1 rounded border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      step="0.001"
                    />
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">
                    2 days ago
                  </td>
                  <td className="py-3 pr-4">
                    <button className="px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50">
                      Calibrate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            Save All Calibrations
          </button>
          <button className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* OTA Update Status */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">OTA Firmware Update</div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${configuration.otaStatus === 'Complete'
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
            : configuration.otaStatus === 'Installing' || configuration.otaStatus === 'Downloading'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
            {configuration.otaStatus}
          </span>
        </div>

        {(configuration.otaStatus === 'Downloading' || configuration.otaStatus === 'Installing') && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Progress</span>
              <span className="font-bold">{configuration.otaProgress}%</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${configuration.otaProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Current Version</div>
            <div className="text-lg font-bold mt-1">{data.deviceHealth.firmwareVersion}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">Latest Available</div>
            <div className="text-lg font-bold mt-1 text-indigo-600 dark:text-indigo-400">v1.6.0</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={configuration.otaStatus !== 'Idle'}
          >
            Start Update
          </button>
          <button className="px-4 py-2.5 border dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            Version History
          </button>
        </div>
      </div>

      {/* Remote Control Toggles */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Remote Control Panel</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'GPS Tracking', enabled: true },
            { label: 'Live Streaming', enabled: false },
            { label: 'Auto-Alerts', enabled: true },
            { label: 'Data Compression', enabled: true }
          ].map((toggle, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{toggle.label}</span>
                <button className={`h-6 w-11 rounded-full transition-colors relative ${toggle.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${toggle.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
