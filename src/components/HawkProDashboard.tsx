"use client";

import { useState, useEffect } from 'react';
import { generateHawkProData, HawkProData } from '@/lib/hawk-pro-data';
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
    ArcElement,
    RadialLinearScale
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Dynamically import all sections
const ExecutiveOverview = dynamic(() => import('./sections/ExecutiveOverview'), { ssr: false });
const DeviceHealth = dynamic(() => import('./sections/DeviceHealth'), { ssr: false });
const ConnectivitySection = dynamic(() => import('./sections/ConnectivitySection'), { ssr: false });
const EnvironmentalSection = dynamic(() => import('./sections/EnvironmentalSection'), { ssr: false });
const AgricultureSection = dynamic(() => import('./sections/AgricultureSection'), { ssr: false });
const WaterUtilitySection = dynamic(() => import('./sections/WaterUtilitySection'), { ssr: false });
const IOCardsSection = dynamic(() => import('./sections/IOCardsSection'), { ssr: false });
const GPSLocationSection = dynamic(() => import('./sections/GPSLocationSection'), { ssr: false });
const AutomationSection = dynamic(() => import('./sections/AutomationSection'), { ssr: false });
const AlertsSection = dynamic(() => import('./sections/AlertsSection'), { ssr: false });
const AnalyticsHistorySection = dynamic(() => import('./sections/AnalyticsHistorySection'), { ssr: false });
const ConfigurationSection = dynamic(() => import('./sections/ConfigurationSection'), { ssr: false });
const SecuritySection = dynamic(() => import('./sections/SecuritySection'), { ssr: false });
const FleetViewSection = dynamic(() => import('./sections/FleetViewSection'), { ssr: false });

export default function HawkProDashboard() {
    const [data, setData] = useState<HawkProData | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('all');
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        setData(generateHawkProData());
    }, []);

    const handleRefresh = () => {
        setData(generateHawkProData());
    };

    const toggleDark = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Account for sticky navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
        }
    };

    if (!data) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <div className="mt-4 text-slate-600 dark:text-slate-400">Loading Hawk Pro Dashboard...</div>
                </div>
            </div>
        );
    }

    const sections = [
        { id: 'executive', name: 'Executive', icon: '📊' },
        { id: 'health', name: 'Health', icon: '🏥' },
        { id: 'connectivity', name: 'Network', icon: '📡' },
        { id: 'environmental', name: 'Environment', icon: '🌡️' },
        { id: 'agriculture', name: 'AgTech', icon: '🌾' },
        { id: 'water', name: 'Water', icon: '💧' },
        { id: 'io', name: 'I/O Cards', icon: '🔌' },
        { id: 'gps', name: 'GPS', icon: '📍' },
        { id: 'automation', name: 'Rules', icon: '⚙️' },
        { id: 'alerts', name: 'Alerts', icon: '🚨' },
        { id: 'analytics', name: 'Analytics', icon: '📈' },
        { id: 'config', name: 'Config', icon: '🛠️' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'fleet', name: 'Fleet', icon: '🌐' },
    ];

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${isDark ? 'dark' : ''}`}>
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b dark:border-slate-800 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white grid place-items-center font-bold text-lg shadow-lg">
                            H
                        </div>
                        <div>
                            <div className="font-bold text-lg">Hawk Pro</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">IoT Data Logger & Sensor Hub</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative px-3 py-2 rounded-lg border dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {data && data.alerts.active.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {data.alerts.active.length}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && data && (
                                <div className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-[80vh] md:max-h-[35rem] flex flex-col overflow-hidden">
                                    <div className="p-4 border-b dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">Notifications</h3>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                            {data.alerts.active.length} active alert{data.alerts.active.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto flex-1">
                                        {data.alerts.active.length > 0 ? (
                                            <div className="divide-y dark:divide-slate-700">
                                                {data.alerts.active.map((alert) => {
                                                    const severityColors = {
                                                        'Critical': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-l-red-500',
                                                        'High': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-l-orange-500',
                                                        'Medium': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-l-amber-500',
                                                        'Low': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-l-blue-500',
                                                    };

                                                    return (
                                                        <div
                                                            key={alert.id}
                                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l-4 ${severityColors[alert.severity as keyof typeof severityColors]}`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="text-2xl">🚨</div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${alert.severity === 'Critical' ? 'bg-red-500 text-white' :
                                                                            alert.severity === 'High' ? 'bg-orange-500 text-white' :
                                                                                alert.severity === 'Medium' ? 'bg-amber-500 text-white' :
                                                                                    'bg-blue-500 text-white'
                                                                            }`}>
                                                                            {alert.severity}
                                                                        </span>
                                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                            {alert.timestamp}
                                                                        </span>
                                                                    </div>
                                                                    <div className="font-semibold text-sm mb-1">{alert.message}</div>
                                                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                                                        Channel: {alert.channel} • ID: {alert.id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-slate-400">
                                                <div className="text-5xl mb-3">✓</div>
                                                <div className="font-semibold">No Active Alerts</div>
                                                <div className="text-xs mt-1">All systems operating normally</div>
                                            </div>
                                        )}
                                    </div>

                                    {data.alerts.active.length > 0 && (
                                        <div className="p-0 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    scrollToSection('alerts');
                                                    setShowNotifications(false);
                                                }}
                                                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                View All Alerts
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button onClick={handleRefresh} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden md:inline">Refresh</span>
                        </button>
                        <button onClick={toggleDark} className="px-3 py-2 rounded-lg border dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>

                {/* Quick Section Navigation */}
                <div className="overflow-x-auto border-t dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex gap-1 py-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${activeSection === section.id
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    <span>{section.icon}</span>
                                    <span>{section.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
                <div id="executive"><ExecutiveOverview data={data} /></div>
                <div id="health"><DeviceHealth data={data} /></div>
                <div id="connectivity"><ConnectivitySection data={data} /></div>
                <div id="environmental"><EnvironmentalSection data={data} /></div>
                <div id="agriculture"><AgricultureSection data={data} /></div>
                <div id="water"><WaterUtilitySection data={data} /></div>
                <div id="io"><IOCardsSection data={data} /></div>
                <div id="gps"><GPSLocationSection data={data} /></div>
                <div id="automation"><AutomationSection data={data} /></div>
                <div id="alerts"><AlertsSection data={data} /></div>
                <div id="analytics"><AnalyticsHistorySection data={data} /></div>
                <div id="config"><ConfigurationSection data={data} /></div>
                <div id="security"><SecuritySection data={data} /></div>
                <div id="fleet"><FleetViewSection data={data} /></div>

                {/* Footer */}
                <footer className="pt-8 pb-4 text-center text-xs text-slate-500 dark:text-slate-600 border-t dark:border-slate-800">
                    <div className="space-y-1">
                        <div>Hawk Pro IoT Dashboard • Comprehensive Monitoring & Control System</div>
                        <div className="text-[10px]">Enterprise-Ready • Government-Compliant • Investor-Grade</div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
