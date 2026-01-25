"use client";

import { Line, Bar } from 'react-chartjs-2';
import { DemoData } from '@/lib/demo-data';

export default function AnalyticsSection({ data }: { data: DemoData }) {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' as const } },
        scales: {
            x: { grid: { display: false } },
            y: { border: { display: false } }
        }
    };

    const batteryTrendChart = {
        labels: data.batteryHistory.map(h => h.time),
        datasets: [
            {
                label: 'Battery %',
                data: data.batteryHistory.map(h => h.percent),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                yAxisID: 'y',
                fill: true
            },
            {
                label: 'Voltage',
                data: data.batteryHistory.map(h => h.voltage),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                yAxisID: 'y1'
            }
        ]
    };

    const networkStatsChart = {
        labels: data.networkStats.labels,
        datasets: [
            {
                label: 'Signal (dBm)',
                data: data.networkStats.signalHistory,
                borderColor: 'rgb(139, 92, 246)',
                tension: 0.4
            },
            {
                label: 'Uplink Success %',
                data: data.networkStats.uplinkSuccess,
                borderColor: 'rgb(34, 197, 94)',
                tension: 0.4
            }
        ]
    };

    const dataUsageChart = {
        labels: data.networkStats.labels,
        datasets: [{
            label: 'Data Usage (MB)',
            data: data.networkStats.dataUsageMB,
            backgroundColor: 'rgba(59, 130, 246, 0.7)'
        }]
    };

    const solarChargingChart = {
        labels: data.envLabels,
        datasets: [
            {
                label: 'Panel Voltage (V)',
                data: data.solarCharging.panelVoltage,
                borderColor: 'rgb(234, 179, 8)',
                yAxisID: 'y'
            },
            {
                label: 'Charge Current (mA)',
                data: data.solarCharging.chargeCurrent,
                borderColor: 'rgb(249, 115, 22)',
                yAxisID: 'y1'
            }
        ]
    };

    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-lg font-semibold">7) Analytics & Trends (Operational Insights)</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Battery health, network performance, and solar charging analytics for predictive maintenance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Battery Health Trend */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="font-medium">Battery Health Trend (24h)</div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                            {data.batteryHistory[data.batteryHistory.length - 1].charging ? 'Charging' : 'Discharging'}
                        </span>
                    </div>
                    <div className="mt-3 h-64">
                        <Line data={batteryTrendChart} options={{
                            ...commonOptions,
                            scales: {
                                y: { type: 'linear', position: 'left', title: { display: true, text: 'Battery %' } },
                                y1: { type: 'linear', position: 'right', title: { display: true, text: 'Voltage (V)' }, grid: { drawOnChartArea: false } }
                            }
                        } as any} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Battery</div>
                            <div className="text-lg font-semibold">{(data.batteryHistory.reduce((a, b) => a + b.percent, 0) / data.batteryHistory.length).toFixed(0)}%</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Voltage</div>
                            <div className="text-lg font-semibold">{(data.batteryHistory.reduce((a, b) => a + b.voltage, 0) / data.batteryHistory.length).toFixed(2)}V</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Charge Cycles</div>
                            <div className="text-lg font-semibold">{data.batteryHistory.filter(h => h.charging).length}</div>
                        </div>
                    </div>
                </div>

                {/* Network Performance */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="font-medium">Network Performance (24h)</div>
                    <div className="mt-3 h-64">
                        <Line data={networkStatsChart} options={commonOptions} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Signal</div>
                            <div className="text-lg font-semibold">{(data.networkStats.signalHistory.reduce((a, b) => a + b, 0) / data.networkStats.signalHistory.length).toFixed(0)} dBm</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Success Rate</div>
                            <div className="text-lg font-semibold">{(data.networkStats.uplinkSuccess.reduce((a, b) => a + b, 0) / data.networkStats.uplinkSuccess.length).toFixed(1)}%</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Total Data</div>
                            <div className="text-lg font-semibold">{data.networkStats.dataUsageMB.reduce((a, b) => a + b, 0).toFixed(1)} MB</div>
                        </div>
                    </div>
                </div>

                {/* Data Usage */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="font-medium">Cellular Data Usage (24h)</div>
                    <div className="mt-3 h-48">
                        <Bar data={dataUsageChart} options={commonOptions} />
                    </div>
                </div>

                {/* Solar Charging (if applicable) */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="font-medium">Solar Charging System</div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                            {data.solarCharging.chargeState}
                        </span>
                    </div>
                    <div className="mt-3 h-48">
                        <Line data={solarChargingChart} options={{
                            ...commonOptions,
                            scales: {
                                y: { type: 'linear', position: 'left', title: { display: true, text: 'Voltage' } },
                                y1: { type: 'linear', position: 'right', title: { display: true, text: 'Current (mA)' }, grid: { drawOnChartArea: false } }
                            }
                        } as any} />
                    </div>
                </div>
            </div>
        </section>
    );
}
