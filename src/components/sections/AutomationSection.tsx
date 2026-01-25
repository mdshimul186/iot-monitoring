"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { Line } from 'react-chartjs-2';

export default function AutomationSection({ data }: { data: HawkProData }) {
  const { automation } = data;

  const latencyChart = {
    labels: data.environmental.timeLabels,
    datasets: [{
      label: 'Execution Latency (ms)',
      data: automation.executionLatency,
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">⚙️</span>
          Automation, Rules & Task Engine
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Edge intelligence control and automated workflows</p>
      </div>

      {/* Active Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {automation.activeRules.map((rule) => (
          <div key={rule.id} className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Rule Header */}
            <div className={`p-4 ${rule.enabled
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
              : 'bg-gradient-to-r from-slate-600 to-slate-700'
              } text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm opacity-90">Automation Rule</div>
                <div className={`h-6 w-11 rounded-full transition-colors relative ${rule.enabled ? 'bg-white/30' : 'bg-white/20'
                  }`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                </div>
              </div>
              <div className="font-bold text-lg">{rule.name}</div>
            </div>

            {/* Rule Flow Diagram */}
            <div className="p-5">
              <div className="space-y-3">
                {/* Condition */}
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">IF (Condition)</div>
                  <div className="text-sm font-mono text-blue-900 dark:text-blue-100">{rule.condition}</div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Action */}
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">THEN (Action)</div>
                  <div className="text-sm font-mono text-emerald-900 dark:text-emerald-100">{rule.action}</div>
                </div>
              </div>

              {/* Last Triggered */}
              <div className="mt-4 pt-4 border-t dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Last Triggered</span>
                  <span className="font-semibold">{rule.lastTriggered}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trigger History & Execution Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trigger History Timeline */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Trigger History (Last 10)</div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {automation.triggerHistory.map((trigger, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className={`h-2 w-2 rounded-full ${trigger.result === 'Success' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{trigger.rule}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{trigger.time}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${trigger.result === 'Success'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}>
                  {trigger.result}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Latency */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Rule Execution Latency (24h)</div>
          <div className="h-64">
            <Line
              data={latencyChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
                }
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Min</div>
              <div className="text-sm font-bold">{Math.min(...automation.executionLatency).toFixed(0)}ms</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg</div>
              <div className="text-sm font-bold">
                {(automation.executionLatency.reduce((a, b) => a + b) / automation.executionLatency.length).toFixed(0)}ms
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-400">Max</div>
              <div className="text-sm font-bold">{Math.max(...automation.executionLatency).toFixed(0)}ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Failed Tasks Log */}
      {automation.failedTasks.length > 0 && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <div className="font-semibold text-red-900 dark:text-red-100 mb-3">Failed Task Logs</div>
              <div className="space-y-2">
                {automation.failedTasks.map((task, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-red-700 dark:text-red-300">{task.task}</span>
                      <span className="text-xs text-red-600 dark:text-red-400">{task.time}</span>
                    </div>
                    <div className="text-xs font-mono text-red-800 dark:text-red-200">{task.error}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="text-xs text-indigo-600 dark:text-indigo-400">Active Rules</div>
            <div className="text-3xl font-bold mt-1">{automation.activeRules.filter(r => r.enabled).length}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="text-xs text-indigo-600 dark:text-indigo-400">Total Triggers</div>
            <div className="text-3xl font-bold mt-1">{automation.triggerHistory.length}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="text-xs text-indigo-600 dark:text-indigo-400">Success Rate</div>
            <div className="text-3xl font-bold mt-1 text-emerald-600">
              {((automation.triggerHistory.filter(t => t.result === 'Success').length / automation.triggerHistory.length) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="text-xs text-indigo-600 dark:text-indigo-400">Avg Latency</div>
            <div className="text-3xl font-bold mt-1">
              {(automation.executionLatency.reduce((a, b) => a + b) / automation.executionLatency.length).toFixed(0)}ms
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
