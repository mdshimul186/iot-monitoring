"use client";

import { DemoData } from '@/lib/demo-data';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function AssetTrackingSection({ data }: { data: DemoData }) {
    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-lg font-semibold">8) Asset Visibility & Movement Tracking</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    GPS location history, movement patterns, and geofence compliance for asset tracking.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Location History Table */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                    <div className="font-medium">Location History (Last 10 Positions)</div>
                    <div className="mt-3 overflow-auto max-h-96">
                        <table className="min-w-full text-sm">
                            <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400">
                                <tr>
                                    <th className="text-left py-2 pr-3">Time</th>
                                    <th className="text-left py-2 pr-3">Latitude</th>
                                    <th className="text-left py-2 pr-3">Longitude</th>
                                    <th className="text-left py-2 pr-3">Speed (km/h)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-700">
                                {data.locationHistory.map((loc, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="py-2 pr-3">{loc.time}</td>
                                        <td className="py-2 pr-3 font-mono text-xs">{loc.lat.toFixed(5)}</td>
                                        <td className="py-2 pr-3 font-mono text-xs">{loc.lng.toFixed(5)}</td>
                                        <td className="py-2 pr-3">{loc.speed.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Total Distance</div>
                            <div className="text-lg font-semibold">{(Math.random() * 50 + 10).toFixed(1)} km</div>
                        </div>
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Speed</div>
                            <div className="text-lg font-semibold">
                                {(data.locationHistory.reduce((a, b) => a + b.speed, 0) / data.locationHistory.length).toFixed(1)} km/h
                            </div>
                        </div>
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Max Speed</div>
                            <div className="text-lg font-semibold">{Math.max(...data.locationHistory.map(l => l.speed)).toFixed(1)} km/h</div>
                        </div>
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Geofence Status</div>
                            <div className="text-lg font-semibold">{data.gps.geofence}</div>
                        </div>
                    </div>
                </div>

                {/* Movement Analytics */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="font-medium">Movement Analytics</div>

                    <div className="mt-3 space-y-3">
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Status</div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${data.gps.speed > 5 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                <span className="font-medium">{data.gps.speed > 5 ? 'Moving' : 'Stationary'}</span>
                            </div>
                        </div>

                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Current Heading</div>
                            <div className="mt-2 text-2xl font-semibold">{data.gps.heading}°</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {data.gps.heading < 45 || data.gps.heading > 315 ? 'North' :
                                    data.gps.heading < 135 ? 'East' :
                                        data.gps.heading < 225 ? 'South' : 'West'}
                            </div>
                        </div>

                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">GPS Accuracy</div>
                            <div className="mt-2 text-lg font-semibold">{data.gps.acc}</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">HDOP: {data.gps.hdop.toFixed(2)}</div>
                        </div>

                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Tamper Detection</div>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    No Movement Detected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
