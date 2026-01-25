"use client";

import React, { useState, useEffect } from 'react';
import { generateDemoData, DemoData } from '@/lib/demo-data';
import { Line, Bar } from 'react-chartjs-2';
import dynamic from 'next/dynamic';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" /> });
const AnalyticsSection = dynamic(() => import('./AnalyticsSection'), { ssr: false });
const AssetTrackingSection = dynamic(() => import('./AssetTrackingSection'), { ssr: false });
const ComplianceSection = dynamic(() => import('./ComplianceSection'), { ssr: false });

export default function Dashboard() {
    const [data, setData] = useState<DemoData | null>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setData(generateDemoData());
    }, []);

    const handleRefresh = () => {
        setData(generateDemoData());
    };

    const toggleDark = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    if (!data) return <div className="min-h-screen grid place-items-center">Loading Demo Data...</div>;

    // Chart Data Helpers
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { border: { display: false } }
        }
    };

    const chartInternalTemp = {
        labels: data.envLabels,
        datasets: [{
            label: 'Internal Temp',
            data: data.internalTempC,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.5)',
            tension: 0.4
        }]
    };

    const chartAccel = {
        labels: data.envLabels,
        datasets: [
            { label: 'X', data: data.accel.x, borderColor: 'rgb(59, 130, 246)', tension: 0.1 },
            { label: 'Y', data: data.accel.y, borderColor: 'rgb(168, 85, 247)', tension: 0.1 },
            { label: 'Z', data: data.accel.z, borderColor: 'rgb(34, 197, 94)', tension: 0.1 },
        ]
    };

    const chartEnv = {
        labels: data.envLabels,
        datasets: [
            { label: 'Temp', data: data.tempC, borderColor: 'rgb(239, 68, 68)', tension: 0.4 },
            { label: 'Hum', data: data.hum, borderColor: 'rgb(59, 130, 246)', tension: 0.4 },
            { label: 'Soil', data: data.soil, borderColor: 'rgb(34, 197, 94)', tension: 0.4 },
        ]
    };

    const chartQuality = {
        labels: data.envLabels,
        datasets: [
            { label: 'Turbidity', data: data.turbidity, backgroundColor: 'rgba(148, 163, 184, 0.8)' },
            { label: 'pH', data: data.ph, type: 'line' as const, borderColor: 'rgb(14, 165, 233)', borderWidth: 2 }
        ]
    };

    const chartPowerOut = {
        labels: data.powerOut.map(d => d.label),
        datasets: [{
            label: 'Power Budget',
            data: data.powerOut.map(d => d.value),
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(249, 115, 22, 0.8)']
        }]
    };

    const chartAnalog = {
        labels: data.analog.map(a => a.ch),
        datasets: [{
            label: 'Value',
            data: data.analog.map(a => a.value),
            backgroundColor: 'rgba(99, 102, 241, 0.7)'
        }]
    };

    const chartPulse = {
        labels: data.envLabels,
        datasets: [{
            label: 'Pulse Count',
            data: data.pulse,
            backgroundColor: 'rgba(16, 185, 129, 0.6)'
        }]
    };

    const chartUptime = {
        labels: data.uptime.map(u => u.day),
        datasets: [{
            label: 'Uptime %',
            data: data.uptime.map(u => u.pct),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: true,
            tension: 0.3
        }]
    };


    // Helpers for pills
    const getSeverityPill = (sev: string) => {
        switch (sev) {
            case 'INFO': return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
            case 'WARN': return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800";
            case 'CRIT': return "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-800";
            case 'OK': return "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800";
            default: return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        }
    };

    const getStatusPill = (ok: boolean, textOk = "OK", textBad = "Issue") => {
        return ok
            ? { cls: "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800", text: textOk }
            : { cls: "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-800", text: textBad };
    };

    // Logic for pills
    const connOk = data.signalDbm > -105;
    const connPill = getStatusPill(connOk, "Connected", "Weak Signal");

    const external = data.vin > 0.1;
    const powerOk = data.batteryPct >= 25 || external;
    const powerPill = getStatusPill(powerOk, external ? "External + Backup" : "Battery", "Low Battery");

    const gpsOk = data.gps.fix !== "No Fix";
    const gpsPill = getStatusPill(gpsOk, "GPS OK", "No Fix");

    const stOk = data.storageUsed < 80;
    const storePill = getStatusPill(stOk, "Healthy", "Near Full");

    const tNow = data.internalTempC[data.internalTempC.length - 1];
    const tOk = tNow < 45;
    const tempPill = getStatusPill(tOk, "Normal", "High");

    const tamperScore = data.accel.x.slice(-3).reduce((a, b) => a + b, 0) + data.accel.y.slice(-3).reduce((a, b) => a + b, 0);
    const tamperOk = tamperScore < 0.6;
    const tamperPill = getStatusPill(tamperOk, "Stable", "Movement");

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 ${isDark ? 'dark' : ''}`}>
            {/* Top Bar */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-slate-900/80 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold dark:bg-slate-800">H</div>
                        <div>
                            <div className="font-semibold leading-tight">Hawk Pro — Sensor Hub Dashboard (Demo)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">LTE-M / NB-IoT • Modular I/O Cards • OTA Config • GPS • Data Logger</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleRefresh} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:opacity-90 dark:bg-blue-600">Generate New Demo Data</button>
                        <button onClick={toggleDark} className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Toggle Dark</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
                {/* SECTION: Overview KPIs */}
                <section className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">1) Overview</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">High-level status, connectivity, battery/power, and quick KPIs.</p>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Device: <span className="font-medium text-slate-700 dark:text-slate-300">{data.deviceId}</span> • Last seen: <span className="font-medium text-slate-700 dark:text-slate-300">{data.lastSeen}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-2xl bg-white border p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500 dark:text-slate-400">Connectivity</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${connPill.cls}`}>{connPill.text}</span>
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{data.connMode}</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Signal: <span className="font-medium text-slate-700 dark:text-slate-300">{data.signalDbm}</span> dBm • SIM: <span className="font-medium text-slate-700 dark:text-slate-300">Micro 3FF</span></div>
                        </div>

                        <div className="rounded-2xl bg-white border p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500 dark:text-slate-400">Battery / Power</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${powerPill.cls}`}>{powerPill.text}</span>
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{data.batteryPct}%</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">VBAT: <span className="font-medium text-slate-700 dark:text-slate-300">{data.vbat.toFixed(2)}</span> V • Input: <span className="font-medium text-slate-700 dark:text-slate-300">{data.vin.toFixed(1)}</span> V</div>
                        </div>

                        <div className="rounded-2xl bg-white border p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500 dark:text-slate-400">GPS</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${gpsPill.cls}`}>{gpsPill.text}</span>
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{data.gps.acc}</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fix: <span className="font-medium text-slate-700 dark:text-slate-300">{data.gps.fix}</span> • Speed: <span className="font-medium text-slate-700 dark:text-slate-300">{data.gps.speed.toFixed(1)}</span> km/h</div>
                        </div>

                        <div className="rounded-2xl bg-white border p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500 dark:text-slate-400">Data Storage</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${storePill.cls}`}>{storePill.text}</span>
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{data.storageUsed}%</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Offline records cached • Upload: <span className="font-medium text-slate-700 dark:text-slate-300">{data.uploadInterval}</span></div>
                        </div>
                    </div>
                </section>

                {/* SECTION: Live Maps + Timeline */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">2) Location & Health Timeline</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">GPS map preview + internal temperature + accelerometer/tamper-style signals.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">GPS Map</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Lat/Lng: <span className="font-medium text-slate-700 dark:text-slate-300">{data.gps.lat.toFixed(5)}, {data.gps.lng.toFixed(5)}</span></div>
                            </div>
                            <div className="mt-3 h-80 w-full rounded-xl border dark:border-slate-700 overflow-hidden relative z-0">
                                <MapComponent lat={data.gps.lat} lng={data.gps.lng} />
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Heading</div>
                                    <div className="text-lg font-semibold">{data.gps.heading}°</div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Satellites</div>
                                    <div className="text-lg font-semibold">{data.gps.sats}</div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">HDOP</div>
                                    <div className="text-lg font-semibold">{data.gps.hdop.toFixed(2)}</div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Geofence</div>
                                    <div className="text-lg font-semibold">{data.gps.geofence}</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="font-medium">Device Health</div>
                            <div className="mt-3 space-y-4">
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Internal Temperature (°C)</div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${tempPill.cls}`}>{tempPill.text}</span>
                                    </div>
                                    <div className="mt-2 h-32">
                                        <Line data={chartInternalTemp} options={commonOptions} />
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Tamper / Movement (3-Axis)</div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${tamperPill.cls}`}>{tamperPill.text}</span>
                                    </div>
                                    <div className="mt-2 h-32">
                                        <Line data={chartAccel} options={commonOptions} />
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">*Demo: accelerometer/tamper chart.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: Sensor Monitoring */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">3) Sensor Monitoring (Environmental / AgTech / Utilities)</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Time-series charts + thresholds + alerts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Environmental Overview (Last 24h)</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Sampling: <span className="font-medium text-slate-700 dark:text-slate-300">{data.samplingRate}</span> • Upload: <span className="font-medium text-slate-700 dark:text-slate-300">{data.uploadInterval}</span></div>
                            </div>
                            <div className="mt-3 h-48">
                                <Line data={chartEnv} options={commonOptions} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Temp (°C)</div>
                                    <div className="text-lg font-semibold">{data.tempC[data.tempC.length - 1].toFixed(1)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Alert @ <span className="font-medium text-slate-700 dark:text-slate-300">&gt; 38°C</span></div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Humidity (%)</div>
                                    <div className="text-lg font-semibold">{data.hum[data.hum.length - 1].toFixed(0)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Alert @ <span className="font-medium text-slate-700 dark:text-slate-300">&lt; 20%</span></div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Soil Moisture (%)</div>
                                    <div className="text-lg font-semibold">{data.soil[data.soil.length - 1].toFixed(0)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Alert @ <span className="font-medium text-slate-700 dark:text-slate-300">&lt; 15%</span></div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Water Level (m)</div>
                                    <div className="text-lg font-semibold">{data.waterM[data.waterM.length - 1].toFixed(2)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Alert @ <span className="font-medium text-slate-700 dark:text-slate-300">&gt; 2.2m</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="font-medium">Active Alerts</div>
                            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Threshold-based tasks/events.</p>

                            <div className="mt-3 space-y-2">
                                {data.alerts.slice(0, 6).map((a, i) => (
                                    <div key={i} className="rounded-xl border p-3 bg-white dark:bg-slate-800 dark:border-slate-700">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-medium text-sm">{a.title}</div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getSeverityPill(a.sev)}`}>{a.sev}</span>
                                        </div>
                                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{a.msg}</div>
                                        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">At: {new Date(a.at).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-xl border p-3 dark:border-slate-700">
                                <div className="text-xs text-slate-500 dark:text-slate-400">Tank Quality (Demo)</div>
                                <div className="mt-2 h-36">
                                    <Bar data={chartQuality as any} options={commonOptions} />
                                </div>
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Turbidity / pH metrics (demo).</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: I/O Cards & Interfaces */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">4) I/O Card Interfaces & Sensor Channels</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Modular I/O cards (demo view).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Card Summary */}
                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Installed I/O Cards (Demo)</div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white dark:bg-slate-700">Modular</span>
                            </div>
                            <div className="mt-3 space-y-2">
                                {data.ioCards.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <div>
                                            <div className="text-xs font-semibold">Slot {c.slot}: {c.name}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Type: {c.type}</div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">{c.status}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-xl border p-3 dark:border-slate-700">
                                <div className="text-xs text-slate-500 dark:text-slate-400">Output Power (Demo)</div>
                                <div className="mt-2 h-36">
                                    <Bar data={chartPowerOut} options={commonOptions} />
                                </div>
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Switched sensor power usage.</div>
                            </div>
                        </div>

                        {/* Analog + 4-20mA */}
                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Analog & 4-20mA Inputs</div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border dark:bg-slate-800 dark:border-slate-700">AgTech / Utilities</span>
                            </div>

                            <div className="mt-3 h-36">
                                <Bar data={chartAnalog} options={commonOptions} />
                            </div>

                            <div className="mt-3 overflow-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400">
                                        <tr>
                                            <th className="text-left py-2 pr-3">Channel</th>
                                            <th className="text-left py-2 pr-3">Type</th>
                                            <th className="text-left py-2 pr-3">Value</th>
                                            <th className="text-left py-2 pr-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-700">
                                        {data.analog.map((a, i) => (
                                            <tr key={i}>
                                                <td className="py-2 pr-3">{a.ch}</td>
                                                <td className="py-2 pr-3 text-xs text-slate-500 dark:text-slate-400">{a.type}</td>
                                                <td className="py-2 pr-3 font-medium">{a.value.toFixed(2)} {a.unit}</td>
                                                <td className="py-2 pr-3">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusPill(a.status === 'OK', 'OK', a.status).cls}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Digital + Pulse + Serial + BLE */}
                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Digital / Pulse / Serial / BLE</div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border dark:bg-slate-800 dark:border-slate-700">Industrial</span>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-3">
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Pulse Counting (Demo)</div>
                                    <div className="mt-2 h-32"><Line data={chartPulse} options={commonOptions} /></div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Digital Inputs / Outputs</div>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {data.digital.map((d, i) => (
                                            <div key={i} className="p-2 rounded bg-slate-50 border text-xs dark:bg-slate-800 dark:border-slate-700 flex justify-between">
                                                <span>{d.name}</span>
                                                <span className={d.state ? "text-emerald-600 font-bold" : "text-slate-400"}>{d.state ? "ON" : "OFF"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Serial Messages</div>
                                    <div className="mt-2 space-y-2 max-h-32 overflow-auto text-[10px] font-mono">
                                        {data.serial.map((s, i) => (
                                            <div key={i} className="truncate">
                                                <span className="text-slate-400">{s.time}</span> <span className="text-blue-500">[{s.port}]</span> {s.payload}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">BLE Sensor Tags</div>
                                    <div className="mt-2 space-y-1">
                                        {data.ble.slice(0, 3).map((b, i) => (
                                            <div key={i} className="flex justify-between text-xs border-b pb-1 last:border-0 dark:border-slate-700">
                                                <span>{b.name}</span>
                                                <span className="font-mono">{b.reading}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: Device Management */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">5) Device Management</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Remote config, OTA, and API actions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Configuration Snapshot</div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">OTA Ready</span>
                            </div>

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Sampling</div>
                                    <div className="mt-2 text-sm space-y-1">
                                        <div className="flex justify-between"><span>Sensor sampling rate</span><span className="font-medium">{data.samplingRate}</span></div>
                                        <div className="flex justify-between"><span>GPS position rate</span><span className="font-medium">5 min</span></div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Upload</div>
                                    <div className="mt-2 text-sm space-y-1">
                                        <div className="flex justify-between"><span>Upload interval</span><span className="font-medium">{data.uploadInterval}</span></div>
                                        <div className="flex justify-between"><span>Payload compression</span><span className="font-medium">On</span></div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Power</div>
                                    <div className="mt-2 text-sm space-y-1">
                                        <div className="flex justify-between"><span>Power source</span><span className="font-medium truncate max-w-[140px]">{external ? "External + Backup" : "Battery"}</span></div>
                                        <div className="flex justify-between"><span>Low battery alert</span><span className="font-medium">Enabled</span></div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Connectivity</div>
                                    <div className="mt-2 text-sm space-y-1">
                                        <div className="flex justify-between"><span>Mode</span><span className="font-medium">{data.connMode}</span></div>
                                        <div className="flex justify-between"><span>APN</span><span className="font-medium">demo.apn</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm dark:bg-slate-700 dark:hover:bg-slate-600">Restart Device</button>
                                <button className="px-3 py-2 rounded-xl border text-sm dark:border-slate-700 dark:hover:bg-slate-800">Push Config</button>
                                <button className="px-3 py-2 rounded-xl border text-sm dark:border-slate-700 dark:hover:bg-slate-800">Schedule OTA</button>
                                <button className="px-3 py-2 rounded-xl border text-sm dark:border-slate-700 dark:hover:bg-slate-800">Export CSV</button>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="font-medium">OTA & Security</div>

                            <div className="mt-3 rounded-xl border p-3 dark:border-slate-700">
                                <div className="text-xs text-slate-500 dark:text-slate-400">Firmware Version</div>
                                <div className="mt-1 text-lg font-semibold">{data.fw}</div>
                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Encrypted: <span className="font-medium text-slate-700 dark:text-slate-300">AES-256</span></div>
                            </div>

                            <div className="mt-3 rounded-xl border p-3 dark:border-slate-700">
                                <div className="text-xs text-slate-500 dark:text-slate-400">OTA Progress (Demo)</div>
                                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                                    <div className="h-2 bg-slate-900 rounded-full dark:bg-blue-600" style={{ width: '45%' }}></div>
                                </div>
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Status: <span className="font-medium text-slate-700 dark:text-slate-300">Idle</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: Tasks & Logs */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">6) Task Management & Event Logs</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Events and threshold triggers.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Event Timeline</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Last 48 events</div>
                            </div>
                            <div className="mt-3 overflow-auto max-h-80">
                                <table className="min-w-full text-sm">
                                    <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400">
                                        <tr>
                                            <th className="text-left py-2 pr-3">Time</th>
                                            <th className="text-left py-2 pr-3">Type</th>
                                            <th className="text-left py-2 pr-3">Message</th>
                                            <th className="text-left py-2 pr-3">Sev</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-700">
                                        {data.events.slice(0, 10).map((e, i) => (
                                            <tr key={i}>
                                                <td className="py-2 pr-3 text-xs whitespace-nowrap">{e.time.split(',')[1]}</td>
                                                <td className="py-2 pr-3 text-xs font-medium">{e.type}</td>
                                                <td className="py-2 pr-3 text-xs opacity-90">{e.msg}</td>
                                                <td className="py-2 pr-3 text-[10px]">{e.sev}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                            <div className="font-medium">Tasks</div>
                            <div className="mt-3 space-y-2">
                                {data.tasks.map((t, i) => (
                                    <div key={i} className="p-2 border rounded-lg text-xs dark:border-slate-700">
                                        <div className="font-semibold">{t.name}</div>
                                        <div className="text-slate-500 dark:text-slate-400 mt-1">{t.action}</div>
                                        <div className="text-[10px] mt-1 text-slate-400">{t.schedule}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-xl border p-3 dark:border-slate-700">
                                <div className="text-xs text-slate-500 dark:text-slate-400">Uptime (7 Days)</div>
                                <div className="mt-2 h-32"><Line data={chartUptime} options={commonOptions} /></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: Analytics & Trends */}
                <AnalyticsSection data={data} />

                {/* SECTION: Asset Tracking */}
                <AssetTrackingSection data={data} />

                {/* SECTION: Compliance & Reporting */}
                <ComplianceSection data={data} />

                {/* Footer */}
                <footer className="py-8 text-xs text-slate-500 dark:text-slate-600 border-t pt-6 dark:border-slate-800">
                    Demo dashboard for Hawk Pro-style sensor hub & data logger workflows • Built with Next.js + Tailwind + Chart.js + Leaflet
                </footer>
            </main>
        </div>
    );
}
