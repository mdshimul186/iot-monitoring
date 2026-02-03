"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line } from 'react-chartjs-2';

export default function ConstructionSection({ data }: { data: HawkProData }) {
    const { construction } = data;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };

    const energyChart = {
        labels: construction.energyPerformance.timeLabels,
        datasets: [{
            label: 'Energy Usage (kW)',
            data: construction.energyPerformance.history,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const trafficChart = {
        labels: construction.occupancy.timeLabels,
        datasets: [{
            label: 'Traffic Flow',
            data: construction.occupancy.trafficFlow,
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200';
            case 'warning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
            case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
            case 'offline': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-white';
            case 'Low': return 'bg-blue-500 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'Good': return 'text-emerald-600 dark:text-emerald-400';
            case 'Fair': return 'text-amber-600 dark:text-amber-400';
            case 'Poor': return 'text-orange-600 dark:text-orange-400';
            case 'Critical': return 'text-red-600 dark:text-red-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl md:text-2xl font-bold">Building & Portfolio Management</h2>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Real-time building performance, security, occupancy, and maintenance oversight</p>
            </div>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Total Buildings</div>
                        <div className="mt-2 text-4xl font-bold">{construction.portfolio.totalBuildings}</div>
                        <div className="mt-2 text-xs opacity-75">{construction.portfolio.onlineBuildings} Online</div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Overall Score</div>
                        <div className="mt-2 text-4xl font-bold">{construction.portfolio.overallScore}%</div>
                        <div className="mt-2 text-xs opacity-75">Portfolio Health</div>
                    </div>
                </div>

                <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform ${construction.portfolio.criticalIssues > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Critical Issues</div>
                        <div className="mt-2 text-4xl font-bold">{construction.portfolio.criticalIssues}</div>
                        <div className="mt-2 text-xs opacity-75">{construction.portfolio.criticalIssues === 0 ? 'All Clear' : 'Immediate Attention'}</div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 opacity-20">
                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="text-sm opacity-90">Current Occupancy</div>
                        <div className="mt-2 text-4xl font-bold">{construction.occupancy.current}</div>
                        <div className="mt-2 text-xs opacity-75">Peak: {construction.occupancy.peak}</div>
                    </div>
                </div>
            </div>

            {/* What's Wrong / Requires Attention / At Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Critical At Risk */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-lg">At Risk</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {construction.atRisk.map((risk) => (
                            <div key={risk.id} className="p-3 rounded-xl border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getSeverityColor(risk.severity)}`}>
                                        {risk.severity}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{risk.category}</span>
                                </div>
                                <div className="font-semibold text-sm mb-1">{risk.issue}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{risk.impact}</div>
                                <div className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">Due: {risk.dueDate}</div>
                            </div>
                        ))}
                        {construction.atRisk.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                <div className="text-5xl mb-2">✓</div>
                                <div className="text-sm">No items at risk</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Requires Attention Today */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-lg">Today's Attention</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {/* Overdue Maintenance */}
                        {construction.maintenance.overdueItems.map((item) => (
                            <div key={item.id} className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getSeverityColor(item.priority)}`}>
                                        {item.priority}
                                    </span>
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">OVERDUE</span>
                                </div>
                                <div className="font-semibold text-sm mb-1">{item.item}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Due: {item.dueDate}</div>
                            </div>
                        ))}
                        {/* Scheduled Today */}
                        <div className="pt-2 border-t dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">SCHEDULED TODAY</div>
                            {construction.maintenance.scheduledToday.map((task, i) => (
                                <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 mb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">{task.item}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{task.time}</div>
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{task.technician}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* What's Wrong */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-lg">What's Wrong</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {/* Equipment Health Issues */}
                        {construction.maintenance.equipmentHealth.filter(e => e.status === 'Critical' || e.status === 'Poor').map((equip, i) => (
                            <div key={i} className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-bold ${getHealthColor(equip.status)}`}>{equip.status.toUpperCase()}</span>
                                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">Equipment</span>
                                </div>
                                <div className="font-semibold text-sm mb-1">{equip.equipment}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Last service: {equip.lastService}</div>
                            </div>
                        ))}
                        {/* Security Issues */}
                        {construction.security.breachAttempts > 0 && (
                            <div className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-red-600 dark:text-red-400">ALERT</span>
                                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">Security</span>
                                </div>
                                <div className="font-semibold text-sm mb-1">{construction.security.breachAttempts} Breach Attempts Detected</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Review security logs immediately</div>
                            </div>
                        )}
                        {construction.security.camerasOnline < construction.security.camerasTotal && (
                            <div className="p-3 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-orange-600 dark:text-orange-400">WARNING</span>
                                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">Surveillance</span>
                                </div>
                                <div className="font-semibold text-sm mb-1">{construction.security.camerasTotal - construction.security.camerasOnline} Cameras Offline</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{construction.security.camerasOnline} of {construction.security.camerasTotal} operational</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Energy Performance & Occupancy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Energy Performance */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg">Energy Performance</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time energy monitoring</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{construction.energyPerformance.currentUsage.toFixed(0)} kW</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Current Usage</div>
                        </div>
                    </div>
                    <div className="h-48 mb-4">
                        <Line data={energyChart} options={chartOptions} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Efficiency</div>
                            <div className="text-lg font-bold mt-1">{construction.energyPerformance.efficiency}%</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Peak Demand</div>
                            <div className="text-lg font-bold mt-1">{construction.energyPerformance.peakDemand.toFixed(0)} kW</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Cost Today</div>
                            <div className="text-lg font-bold mt-1">${construction.energyPerformance.costToday.toFixed(0)}</div>
                        </div>
                    </div>
                </div>

                {/* Occupancy & Traffic */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg">Occupancy & Traffic</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time people flow</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{construction.occupancy.current}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Current Occupancy</div>
                        </div>
                    </div>
                    <div className="h-48 mb-4">
                        <Line data={trafficChart} options={chartOptions} />
                    </div>
                    <div className="space-y-2">
                        {construction.occupancy.zones.map((zone, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="text-sm font-medium">{zone.name}</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${zone.utilization > 80 ? 'bg-red-500' : zone.utilization > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${zone.utilization}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs font-medium w-16 text-right">{zone.current}/{zone.capacity}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Security & Building Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Security Overview */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Security Status</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Cameras</div>
                            <div className="text-2xl font-bold mt-1">{construction.security.camerasOnline}/{construction.security.camerasTotal}</div>
                            <div className={`text-xs mt-1 ${construction.security.camerasOnline === construction.security.camerasTotal ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {construction.security.camerasOnline === construction.security.camerasTotal ? 'All Online' : `${construction.security.camerasTotal - construction.security.camerasOnline} Offline`}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Breach Attempts</div>
                            <div className={`text-2xl font-bold mt-1 ${construction.security.breachAttempts > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {construction.security.breachAttempts}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 24h</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">LOCK STATUS</div>
                        {construction.security.lockStatus.map((lock, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                <span className="text-sm">{lock.zone}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${lock.status === 'Locked' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' :
                                    lock.status === 'Unlocked' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                    }`}>
                                    {lock.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Building Status Overview */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Building Status</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {construction.buildings.map((building) => (
                            <div key={building.id} className="p-3 rounded-xl border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">{building.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(building.status)}`}>
                                        {building.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400">Energy</div>
                                        <div className="font-semibold">{building.energyScore}%</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400">Security</div>
                                        <div className="font-semibold">{building.securityScore}%</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400">Occupancy</div>
                                        <div className="font-semibold">{building.occupancy}/{building.maxOccupancy}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Maintenance Summary */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Maintenance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                        <div className="text-sm opacity-90">Open Work Orders</div>
                        <div className="text-4xl font-bold mt-2">{construction.maintenance.workOrders.open}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <div className="text-sm opacity-90">In Progress</div>
                        <div className="text-4xl font-bold mt-2">{construction.maintenance.workOrders.inProgress}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        <div className="text-sm opacity-90">Completed</div>
                        <div className="text-4xl font-bold mt-2">{construction.maintenance.workOrders.completed}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
