"use client";

import { useState, useEffect } from 'react';
import { generateHawkProData, HawkProData } from '@/lib/hawk-pro-data';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import Image from 'next/image';
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
const ConstructionSection = dynamic(() => import('./sections/ConstructionSection'), { ssr: false });

export default function HawkProDashboard() {
    const [data, setData] = useState<HawkProData | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('all');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

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
            const offset = 20;
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
                    <div className="mt-4 text-slate-600 dark:text-slate-400">Loading BIMIQ Dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${isDark ? 'dark' : ''}`}>
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b dark:border-slate-800 shadow-sm">
                <div className="h-16 px-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="h-12 w-40 relative">
                            <Image
                                src={isDark ? "/dark_logo.png" : "/white_logo.png"}
                                alt="BIMIQ Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative px-3 py-2 rounded-lg border dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Notifications"
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

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                            title="Refresh Data"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden md:inline">Refresh</span>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDark}
                            className="px-3 py-2 rounded-lg border dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold grid place-items-center">
                                    JD
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium">John Doe</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Admin</div>
                                </div>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="p-4 border-b dark:border-slate-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold grid place-items-center">
                                                    JD
                                                </div>
                                                <div>
                                                    <div className="font-bold">John Doe</div>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400">john.doe@hawkpro.io</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Profile</span>
                                            </button>
                                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Settings</span>
                                            </button>
                                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                                <span>Preferences</span>
                                            </button>
                                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Help & Support</span>
                                            </button>
                                        </div>

                                        <div className="border-t dark:border-slate-700">
                                            <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <Sidebar
                activeSection={activeSection}
                onSectionClick={scrollToSection}
            />

            {/* Notification Modal */}
            {showNotifications && data && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-2xl">Notifications</h3>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {data.alerts.active.length} active alert{data.alerts.active.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-4">
                            {data.alerts.active.length > 0 ? (
                                <div className="space-y-3">
                                    {data.alerts.active.map((alert) => {
                                        const severityColors = {
                                            'Critical': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                                            'High': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
                                            'Medium': 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                                            'Low': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                                        };

                                        return (
                                            <div
                                                key={alert.id}
                                                className={`p-5 rounded-xl border-2 ${severityColors[alert.severity as keyof typeof severityColors]} transition-all hover:shadow-md`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="text-3xl">🚨</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.severity === 'Critical' ? 'bg-red-500 text-white' :
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
                                                        <div className="font-bold text-base mb-2">{alert.message}</div>
                                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                                            Channel: <span className="font-medium">{alert.channel}</span> • ID: <span className="font-mono text-xs">{alert.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-16 text-center text-slate-400">
                                    <div className="text-6xl mb-4">✓</div>
                                    <div className="font-bold text-xl">No Active Alerts</div>
                                    <div className="text-sm mt-2">All systems operating normally</div>
                                </div>
                            )}
                        </div>

                        {data.alerts.active.length > 0 && (
                            <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        scrollToSection('alerts');
                                        setShowNotifications(false);
                                    }}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    View All Alerts
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="ml-16 lg:ml-72 mt-16 transition-all duration-300 px-6 py-6 space-y-8">
                <div id="construction"><ConstructionSection data={data} /></div>
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
                        <div>BIMIQ IoT Dashboard • Comprehensive Monitoring & Control System</div>
                        <div className="text-[10px]">Enterprise-Ready • Government-Compliant • Investor-Grade</div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
