"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { useState, useEffect } from 'react';

export default function ExecutiveOverview({ data }: { data: HawkProData }) {
    const [executive, setExecutive] = useState(data.executive);
    const [isLive, setIsLive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Simulate live data updates every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setExecutive(prev => ({
                ...prev,
                batteryLevel: Math.round(Math.max(20, Math.min(100, prev.batteryLevel + (Math.random() - 0.5) * 2))),
                healthScore: Math.round(Math.max(75, Math.min(100, prev.healthScore + (Math.random() - 0.5) * 1))),
                lastSync: new Date().toLocaleTimeString(),
                lastGPSFix: new Date(Date.now() - Math.random() * 60000).toLocaleTimeString(),
            }));
            setLastUpdate(new Date());
            setIsLive(false);
            setTimeout(() => setIsLive(true), 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Hawk Pro — IoT Dashboard</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Executive Overview • Instant Situational Awareness</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${executive.deviceStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="font-semibold">{executive.deviceStatus === 'online' ? 'ONLINE' : 'OFFLINE'}</span>

                    {/* Live Indicator */}
                    <div className="ml-3 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                        <div className={`h-2 w-2 rounded-full bg-blue-500 ${isLive ? 'animate-pulse' : ''}`}></div>
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">LIVE</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards with Live Updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Device Status */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Health Score</div>
                        <div className="mt-2 text-4xl font-bold transition-all duration-500">{executive.healthScore}%</div>
                        <div className="mt-2 text-xs opacity-75">System Optimal</div>
                    </div>
                </div>

                {/* Battery with Live Update Animation */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3z" />
                            <path fillRule="evenodd" d="M3 6h11v8H3V6zm0-1a1 1 0 00-1 1v8a1 1 0 001 1h11a1 1 0 001-1V6a1 1 0 00-1-1H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90 flex items-center gap-2">
                            Battery
                            {executive.batteryCharging && (
                                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="mt-2 text-4xl font-bold transition-all duration-500">{executive.batteryLevel}%</div>
                        <div className="mt-2 text-xs opacity-75">{executive.batteryCharging ? 'Charging' : 'Discharging'}</div>
                    </div>
                </div>

                {/* Connectivity with Live Sync Time */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Network</div>
                        <div className="mt-2 text-3xl font-bold">{executive.connectivity}</div>
                        <div className="mt-2 text-xs opacity-75 transition-all duration-300">Last sync: {executive.lastSync}</div>
                    </div>
                </div>

                {/* Alerts */}
                <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 ${executive.activeAlerts > 0
                    ? 'bg-gradient-to-br from-orange-500 to-red-600'
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }`}>
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Active Alerts</div>
                        <div className="mt-2 text-4xl font-bold">{executive.activeAlerts}</div>
                        <div className="mt-2 text-xs opacity-75">{executive.activeAlerts === 0 ? 'All Clear' : 'Requires Attention'}</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar with Live Updates */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Updating every 3s
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Last GPS Fix</div>
                        <div className="mt-1 font-semibold transition-all duration-300">{executive.lastGPSFix}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Data Sync</div>
                        <div className="mt-1 font-semibold transition-all duration-300">{executive.lastSync}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400">System Status</div>
                        <div className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">Operational</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Health Score</div>
                        <div className="mt-1">
                            <div className="inline-flex items-center gap-1">
                                <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${executive.healthScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold transition-all duration-500">{executive.healthScore}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
