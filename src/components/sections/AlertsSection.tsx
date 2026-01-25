"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { useState } from 'react';

export default function AlertsSection({ data }: { data: HawkProData }) {
  const [alerts, setAlerts] = useState(data.alerts);
  const [filter, setFilter] = useState<string>('all');

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => ({
      ...prev,
      active: prev.active.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert
      )
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'from-red-600 to-rose-700';
      case 'High': return 'from-orange-500 to-red-600';
      case 'Medium': return 'from-amber-500 to-orange-600';
      case 'Low': return 'from-blue-500 to-indigo-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800';
      case 'Medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      case 'Low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredAlerts = filter === 'all'
    ? alerts.active
    : alerts.active.filter(a => a.severity === filter);

  const avgResolutionTime = alerts.resolved.length > 0
    ? alerts.resolved.reduce((sum, r) => sum + r.resolutionTime, 0) / alerts.resolved.length
    : 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">🚨</span>
          Alerts & Notifications Center
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Incident management and response coordination</p>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
          const count = alerts.active.filter(a => a.severity === severity).length;
          return (
            <div
              key={severity}
              onClick={() => setFilter(filter === severity ? 'all' : severity)}
              className={`rounded-xl bg-gradient-to-br ${getSeverityColor(severity)} p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform ${filter === severity ? 'ring-4 ring-white/50' : ''
                }`}
            >
              <div className="text-sm opacity-90">{severity}</div>
              <div className="mt-1 text-4xl font-bold">{count}</div>
              <div className="mt-1 text-xs opacity-75">Active Alerts</div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            All ({alerts.active.length})
          </button>
          {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === severity
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              {severity} ({alerts.active.filter(a => a.severity === severity).length})
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredAlerts.length} of {alerts.active.length} alerts
        </div>
      </div>

      {/* Alert Queue */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-slate-800">
          <div className="font-semibold">Active Alert Queue</div>
        </div>

        {filteredAlerts.length > 0 ? (
          <div className="divide-y dark:divide-slate-800">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Severity Indicator */}
                  <div className={`h-12 w-1 rounded-full bg-gradient-to-b ${getSeverityColor(alert.severity)}`}></div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{alert.timestamp}</span>
                        </div>
                        <div className="font-semibold text-lg">{alert.message}</div>
                      </div>

                      {/* Acknowledgement Button */}
                      <button
                        onClick={() => !alert.acknowledged && handleAcknowledge(alert.id)}
                        disabled={alert.acknowledged}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${alert.acknowledged
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                      >
                        {alert.acknowledged ? '✓ Acknowledged' : 'Acknowledge'}
                      </button>
                    </div>

                    {/* Alert Details */}
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Channel: {alert.channel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>ID: {alert.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <div className="text-5xl mb-3">✓</div>
            <div className="text-lg font-semibold">No Active Alerts</div>
            <div className="text-sm mt-1">All systems operating normally</div>
          </div>
        )}
      </div>

      {/* SLA Metrics & Resolution Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response SLA */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Response SLA Metrics</div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Critical Response Time</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 5 min</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">High Response Time</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 15 min</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Overall SLA Compliance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">94%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Statistics */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Resolution Statistics</div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total Resolved</span>
              <span className="font-bold">{alerts.resolved.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Avg Resolution Time</span>
              <span className="font-bold">{avgResolutionTime.toFixed(0)} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Active Alerts</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{alerts.active.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Resolution Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {((alerts.resolved.length / (alerts.resolved.length + alerts.active.length)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Notification Channels</div>
          <div className="space-y-3">
            {['SMS', 'Email', 'Webhook', 'Push'].map((channel) => {
              const count = alerts.active.filter(a => a.channel === channel).length;
              return (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">{channel}</span>
                  </div>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Resolved */}
      {alerts.resolved.length > 0 && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
          <div className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Recently Resolved Alerts</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.resolved.slice(0, 4).map((resolved) => (
              <div key={resolved.id} className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Alert {resolved.id}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">{resolved.resolutionTime} min</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Resolved: {resolved.resolvedAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
