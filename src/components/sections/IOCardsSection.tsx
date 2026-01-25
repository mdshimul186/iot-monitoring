"use client";

import { HawkProData } from '@/lib/hawk-pro-data';
import { useState } from 'react';

export default function IOCardsSection({ data }: { data: HawkProData }) {
  const { ioCards } = data;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">🔌</span>
          I/O Card & Sensor Details
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Deep technical visibility into modular sensor interfaces</p>
      </div>

      {/* I/O Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ioCards.map((card) => (
          <div key={card.id} className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div
              className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all"
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">I/O Card</div>
                  <div className="text-2xl font-bold mt-1">{card.type}</div>
                  <div className="text-xs opacity-75 mt-1">{card.inputs.length} Active Inputs</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-bold">{card.inputs.length}</div>
                    <div className="text-xs opacity-75">Channels</div>
                  </div>
                  <svg
                    className={`w-6 h-6 transition-transform ${expandedCard === card.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Channel Mapping - Expandable */}
            {expandedCard === card.id && (
              <div className="p-5 space-y-3 animate-in slide-in-from-top">
                {card.inputs.map((input, idx) => (
                  <div key={idx} className="rounded-xl border dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    {/* Input Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300">
                          {input.channel}
                        </div>
                        <div>
                          <div className="font-semibold">{input.sensorType}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Channel {input.channel}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${input.health === 'OK' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' :
                        input.health === 'WARN' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                        {input.health}
                      </div>
                    </div>

                    {/* Raw vs Calibrated Values */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Raw Value</div>
                        <div className="text-lg font-bold font-mono">{input.rawValue.toFixed(2)}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Calibrated</div>
                        <div className="text-lg font-bold font-mono text-indigo-700 dark:text-indigo-300">
                          {input.calibratedValue.toFixed(2)} {input.unit}
                        </div>
                      </div>
                    </div>

                    {/* Power Consumption */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Power Consumption</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                            style={{ width: `${Math.min(100, (input.powerConsumption / 30) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold w-16 text-right">{input.powerConsumption.toFixed(1)} mA</span>
                      </div>
                    </div>

                    {/* Visual Indicator */}
                    <div className="mt-3 pt-3 border-t dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Signal Quality</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((bar) => (
                            <div
                              key={bar}
                              className={`w-1.5 h-3 rounded-full ${bar <= Math.ceil((input.calibratedValue / 100) * 5)
                                ? 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                              style={{ height: `${bar * 3}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Card Summary */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Total Power</div>
                      <div className="text-lg font-bold">
                        {card.inputs.reduce((sum, input) => sum + input.powerConsumption, 0).toFixed(1)} mA
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Healthy Sensors</div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {card.inputs.filter(i => i.health === 'OK').length}/{card.inputs.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Card Status</div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed View - Quick Stats */}
            {expandedCard !== card.id && (
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Inputs</div>
                    <div className="text-xl font-bold">{card.inputs.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Power</div>
                    <div className="text-xl font-bold">
                      {card.inputs.reduce((sum, input) => sum + input.powerConsumption, 0).toFixed(0)}mA
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Health</div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {card.inputs.filter(i => i.health === 'OK').length}/{card.inputs.length}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Click to expand details →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* System Overview */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">⚡</div>
          <div className="flex-1">
            <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">System Power Budget</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400">Total Cards</div>
                <div className="text-2xl font-bold">{ioCards.length}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400">Total Sensors</div>
                <div className="text-2xl font-bold">{ioCards.reduce((sum, card) => sum + card.inputs.length, 0)}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400">Total Power</div>
                <div className="text-2xl font-bold">
                  {ioCards.reduce((sum, card) =>
                    sum + card.inputs.reduce((s, i) => s + i.powerConsumption, 0), 0
                  ).toFixed(0)}mA
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-xs text-indigo-600 dark:text-indigo-400">System Health</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {((ioCards.reduce((sum, card) =>
                    sum + card.inputs.filter(i => i.health === 'OK').length, 0
                  ) / ioCards.reduce((sum, card) => sum + card.inputs.length, 0)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
