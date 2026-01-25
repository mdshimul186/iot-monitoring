$sections = @(
  "DeviceHealth",
  "ConnectivitySection",
  "EnvironmentalSection",
  "AgricultureSection",
  "WaterUtilitySection",
  "IOCardsSection",
  "GPSLocationSection",
  "AutomationSection",
  "AlertsSection",
  "AnalyticsHistorySection",
  "ConfigurationSection",
  "SecuritySection",
  "FleetViewSection"
)

foreach ($section in $sections) {
  $content = @"
"use client";

import { HawkProData } from '@/lib/hawk-pro-data';

export default function $section({ data }: { data: HawkProData }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">$section</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Section content coming soon...</p>
      </div>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center">
        <div className="text-slate-400">Component under development</div>
      </div>
    </section>
  );
}
"@

  $filePath = "src\components\sections\$section.tsx"
  Set-Content -Path $filePath -Value $content
  Write-Host "Created $filePath"
}
