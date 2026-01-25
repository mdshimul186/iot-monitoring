"use client";

import { DemoData } from '@/lib/demo-data';

export default function ComplianceSection({ data }: { data: DemoData }) {
    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-lg font-semibold">9) Compliance & Reporting (Audit Trail)</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Data collection metrics, system audit logs, and export capabilities for regulatory compliance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Compliance Metrics */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="font-medium">Compliance Metrics</div>

                    <div className="mt-4 space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Data Collection Coverage</span>
                                <span className="font-semibold">{data.compliance.coverage.toFixed(2)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${data.compliance.coverage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">System Uptime</span>
                                <span className="font-semibold">{data.compliance.uptime.toFixed(2)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${data.compliance.uptime}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Total Data Points Collected</div>
                            <div className="mt-1 text-2xl font-semibold">{data.compliance.dataPoints.toLocaleString()}</div>
                        </div>

                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Last Data Export</div>
                            <div className="mt-1 text-lg font-semibold">{data.compliance.lastExport}</div>
                        </div>

                        <div className="rounded-xl border p-3 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Compliance Status</div>
                                    <div className="text-xs text-emerald-700 dark:text-emerald-300">All regulatory requirements met</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Log */}
                <div className="rounded-2xl bg-white border shadow-sm p-4 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="font-medium">System Audit Log</div>
                        <button className="text-xs px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Export Full Log
                        </button>
                    </div>

                    <div className="mt-3 overflow-auto max-h-96">
                        <table className="min-w-full text-sm">
                            <thead className="text-xs text-slate-500 border-b dark:border-slate-700 dark:text-slate-400 sticky top-0 bg-white dark:bg-slate-900">
                                <tr>
                                    <th className="text-left py-2 pr-3">Timestamp</th>
                                    <th className="text-left py-2 pr-3">Action</th>
                                    <th className="text-left py-2 pr-3">User/Service</th>
                                    <th className="text-left py-2 pr-3">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-700">
                                {data.auditLog.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="py-2 pr-3 text-xs whitespace-nowrap">{log.timestamp}</td>
                                        <td className="py-2 pr-3">{log.action}</td>
                                        <td className="py-2 pr-3 text-xs font-mono">{log.user}</td>
                                        <td className="py-2 pr-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${log.result === 'Success'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
                                                }`}>
                                                {log.result}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:opacity-90 dark:bg-blue-600">
                            Export to CSV
                        </button>
                        <button className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Export to PDF
                        </button>
                        <button className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Generate Report
                        </button>
                        <button className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Schedule Email Report
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
