"use client";

import { useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    icon: React.ReactElement;
    submenu?: { id: string; name: string }[];
}

interface SidebarProps {
    activeSection: string;
    onSectionClick: (sectionId: string) => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export default function Sidebar({
    activeSection,
    onSectionClick,
    isMobileOpen,
    onMobileClose,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['buildings', 'monitoring', 'system']);

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const menuItems: MenuItem[] = [
        {
            id: 'buildings',
            name: 'Buildings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            submenu: [
                { id: 'construction', name: 'Portfolio Management' },
            ],
        },
        {
            id: 'overview',
            name: 'Overview',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            submenu: [
                { id: 'executive', name: 'Executive Dashboard' },
                { id: 'fleet', name: 'Fleet View' },
                { id: 'analytics', name: 'Analytics & Reports' },
            ],
        },
        {
            id: 'monitoring',
            name: 'Monitoring',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            submenu: [
                { id: 'health', name: 'Device Health' },
                { id: 'connectivity', name: 'Connectivity' },
                { id: 'gps', name: 'GPS Location' },
                { id: 'alerts', name: 'Alerts & Events' },
            ],
        },
        {
            id: 'sensors',
            name: 'Sensors',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            submenu: [
                { id: 'environmental', name: 'Environmental' },
                { id: 'agriculture', name: 'Agriculture' },
                { id: 'water', name: 'Water Utility' },
                { id: 'io', name: 'I/O Cards' },
            ],
        },
        {
            id: 'system',
            name: 'System',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            submenu: [
                { id: 'automation', name: 'Automation' },
                { id: 'config', name: 'Configuration' },
                { id: 'security', name: 'Security' },
            ],
        },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r dark:border-slate-800 transition-all duration-300 z-40 flex flex-col shadow-xl ${
                    isCollapsed ? 'w-16' : 'w-72'
                } ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Collapse Toggle Button - Floating on the edge (Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-md hidden lg:flex items-center justify-center group"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg
                        className={`w-3 h-3 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${isCollapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <div className="space-y-1">
                        {menuItems.map((menu) => (
                            <div key={menu.id}>
                                <button
                                    onClick={() => toggleMenu(menu.id)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                    title={isCollapsed ? menu.name : ''}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {menu.icon}
                                        </div>
                                        {!isCollapsed && (
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                                                {menu.name}
                                            </span>
                                        )}
                                    </div>
                                    {!isCollapsed && menu.submenu && (
                                        <svg
                                            className={`w-4 h-4 text-slate-400 transition-transform ${expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Submenu */}
                                {!isCollapsed && menu.submenu && expandedMenus.includes(menu.id) && (
                                    <div className="ml-11 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                                        {menu.submenu.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => onSectionClick(item.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === item.id
                                                    ? 'bg-blue-600 text-white font-medium'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Footer Info */}
                {!isCollapsed && (
                    <div className="px-4 py-3 border-t dark:border-slate-800">
                        <div className="text-[10px] text-slate-500 dark:text-slate-600 space-y-0.5">
                            <div>v2.4.1</div>
                            <div>© 2026 BIMIQ</div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onMobileClose}
                />
            )}
        </>
    );
}
