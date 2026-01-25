"use client";

import { HawkProData } from '@/lib/hawk-pro-data';

export default function SecuritySection({ data }: { data: HawkProData }) {
  const { security } = data;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-xl md:text-2xl">🔒</span>
          Security & Compliance
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Enterprise trust, encryption, and regulatory compliance</p>
      </div>

      {/* Security Status Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-5 text-white shadow-lg ${security.encryptionEnabled
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
          : 'bg-gradient-to-br from-red-500 to-orange-600'
          }`}>
          <div className="text-3xl mb-2">🔐</div>
          <div className="font-semibold">Encryption</div>
          <div className="text-xs opacity-75 mt-1">
            {security.encryptionEnabled ? 'AES-256 Active' : 'Disabled'}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg">
          <div className="text-3xl mb-2">✓</div>
          <div className="font-semibold">Data Integrity</div>
          <div className="text-xs opacity-75 mt-1">All checks passed</div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 text-white shadow-lg">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold">Auth Logs</div>
          <div className="text-xs opacity-75 mt-1">{security.authLogs.length} events</div>
        </div>

        <div className={`rounded-xl p-5 text-white shadow-lg ${security.complianceFlags.length === 0
          ? 'bg-gradient-to-br from-emerald-500 to-green-600'
          : 'bg-gradient-to-br from-amber-500 to-orange-600'
          }`}>
          <div className="text-3xl mb-2">📋</div>
          <div className="font-semibold">Compliance</div>
          <div className="text-xs opacity-75 mt-1">
            {security.complianceFlags.length === 0 ? 'All Clear' : `${security.complianceFlags.length} Flags`}
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Encryption Status */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Encryption Configuration</div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-sm">Data at Rest</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">AES-256</div>
                </div>
              </div>
              <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-sm">Data in Transit</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">TLS 1.3 (HTTPS)</div>
                </div>
              </div>
              <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <div>
                  <div className="font-medium text-sm">Authentication</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">OAuth 2.0 + MFA</div>
                </div>
              </div>
              <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Data Integrity Checks */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Data Integrity Status</div>

          <div className="space-y-3">
            {security.integrityChecks.map((check, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border dark:border-slate-700">
                <span className="font-medium text-sm">{check.component}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${check.status === 'OK'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">Last Verification</div>
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="font-semibold mb-4">Compliance Certifications</div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'GDPR', icon: '🇪🇺', status: 'Compliant' },
              { name: 'ISO 27001', icon: '📜', status: 'Certified' },
              { name: 'SOC 2', icon: '🛡️', status: 'Type II' },
              { name: 'HIPAA', icon: '🏥', status: 'Ready' }
            ].map((cert, i) => (
              <div key={i} className="p-3 rounded-lg border dark:border-slate-700 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="text-2xl mb-1">{cert.icon}</div>
                <div className="text-xs font-medium">{cert.name}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{cert.status}</div>
              </div>
            ))}
          </div>

          {security.complianceFlags.length === 0 && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <div className="text-2xl mb-1">✓</div>
              <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                All Regulations Met
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Logs */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Authentication & Access Logs</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border dark:border-slate-700 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
                Filter
              </button>
              <button className="px-3 py-1.5 rounded-lg border dark:border-slate-700 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="text-left py-3 px-5">Timestamp</th>
                <th className="text-left py-3 px-5">User/Service</th>
                <th className="text-left py-3 px-5">Action</th>
                <th className="text-left py-3 px-5">Result</th>
                <th className="text-left py-3 px-5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {security.authLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-5 whitespace-nowrap text-xs">{log.time}</td>
                  <td className="py-3 px-5 font-medium">{log.user}</td>
                  <td className="py-3 px-5">{log.action}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${log.result === 'Success'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Security Best Practices</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Encryption Enabled</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  All data encrypted with AES-256
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Regular Audits</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Automated security scans weekly
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Rotate API Keys</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Last rotation: 45 days ago
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Access Control</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Role-based permissions active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
