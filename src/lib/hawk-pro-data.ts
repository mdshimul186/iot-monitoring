// Comprehensive BIMIQ Dashboard Data Structure
export interface HawkProData {
    // 1. Executive Overview
    executive: {
        deviceStatus: 'online' | 'offline';
        batteryLevel: number;
        batteryCharging: boolean;
        connectivity: 'LTE-M' | 'NB-IoT';
        lastSync: string;
        activeAlerts: number;
        lastGPSFix: string;
        healthScore: number;
    };

    // 2. Device Health
    deviceHealth: {
        batteryVoltage: number;
        powerSource: 'Battery' | 'Solar' | 'External' | 'Hybrid';
        signalStrength: number;
        internalTemp: number;
        memoryUsage: number;
        firmwareVersion: string;
        uptime: string;
        lastRebootReason: string;
        faultCodes: string[];
        healthTimeline: Array<{ time: string; score: number }>;
    };

    // 3. Connectivity
    connectivity: {
        networkType: 'LTE-M' | 'NB-IoT';
        carrier: string;
        signalHistory: number[];
        dataUsageUp: number[];
        dataUsageDown: number[];
        packetSuccess: number[];
        offlineDuration: Array<{ start: string; end: string; duration: number }>;
        timeLabels: string[];
    };

    // 4. Environmental
    environmental: {
        ambientTemp: number[];
        internalTemp: number[];
        humidity: number[];
        pressure: number[];
        rainfall: number[];
        airQuality: number[];
        soilTemp: number[];
        timeLabels: string[];
        thresholds: { min: number; max: number };
    };

    // 5. Agriculture
    agriculture: {
        soilMoisture: Array<{ zone: string; value: number; depth: string }>;
        soilPH: number[];
        electricalConductivity: number[];
        irrigationStatus: boolean;
        rainfallPulses: number[];
        cropZones: Array<{ name: string; moisture: number; ph: number; status: string }>;
    };

    // 6. Water & Utility
    waterUtility: {
        tankLevel: number;
        tankCapacity: number;
        flowRate: number;
        pressure: number;
        turbidity: number;
        tds: number;
        leakEvents: Array<{ time: string; severity: string }>;
        pumpHistory: Array<{ time: string; state: 'ON' | 'OFF' }>;
        flowHistory: number[];
    };

    // 7. I/O Cards
    ioCards: Array<{
        id: string;
        type: string;
        inputs: Array<{
            channel: string;
            sensorType: string;
            rawValue: number;
            calibratedValue: number;
            unit: string;
            powerConsumption: number;
            health: 'OK' | 'WARN' | 'ERROR';
        }>;
    }>;

    // 8. GPS & Location
    gps: {
        currentLat: number;
        currentLng: number;
        accuracy: number;
        movementHistory: Array<{ lat: number; lng: number; time: string; speed: number }>;
        speed: number;
        geofenceStatus: 'Inside' | 'Outside';
        tamperEvents: Array<{ time: string; type: string }>;
    };

    // 9. Automation Rules
    automation: {
        activeRules: Array<{
            id: string;
            name: string;
            condition: string;
            action: string;
            enabled: boolean;
            lastTriggered: string;
        }>;
        triggerHistory: Array<{ time: string; rule: string; result: string }>;
        failedTasks: Array<{ time: string; task: string; error: string }>;
        executionLatency: number[];
    };

    // 10. Alerts
    alerts: {
        active: Array<{
            id: string;
            severity: 'Low' | 'Medium' | 'High' | 'Critical';
            message: string;
            timestamp: string;
            acknowledged: boolean;
            channel: string;
        }>;
        resolved: Array<{ id: string; resolvedAt: string; resolutionTime: number }>;
    };

    // 11. Historical Analytics
    analytics: {
        longTermTrends: Array<{ date: string; avgTemp: number; avgHumidity: number; avgSoil: number }>;
        anomalies: Array<{ time: string; metric: string; value: number; expected: number }>;
        correlations: Array<{ metric1: string; metric2: string; correlation: number }>;
    };

    // 12. Configuration
    configuration: {
        samplingRate: string;
        uploadInterval: string;
        powerProfile: string;
        sensorCalibration: Array<{ sensor: string; offset: number; scale: number }>;
        otaStatus: string;
        otaProgress: number;
    };

    // 13. Security
    security: {
        encryptionEnabled: boolean;
        authLogs: Array<{ time: string; user: string; action: string; result: string }>;
        accessHistory: Array<{ time: string; ip: string; action: string }>;
        integrityChecks: Array<{ component: string; status: 'OK' | 'FAIL' }>;
        complianceFlags: string[];
    };

    // 14. Fleet View (Multi-device)
    fleet: {
        devices: Array<{
            id: string;
            name: string;
            status: 'online' | 'offline';
            battery: number;
            signal: number;
            location: { lat: number; lng: number };
            lastSeen: string;
        }>;
        regionalSummary: Array<{ region: string; online: number; offline: number }>;
    };

    // 15. Construction & Building Management
    construction: {
        portfolio: {
            totalBuildings: number;
            onlineBuildings: number;
            overallScore: number;
            criticalIssues: number;
        };
        buildings: Array<{
            id: string;
            name: string;
            status: 'operational' | 'warning' | 'critical' | 'offline';
            occupancy: number;
            maxOccupancy: number;
            energyScore: number;
            securityScore: number;
            maintenanceScore: number;
        }>;
        energyPerformance: {
            currentUsage: number; // kW
            peakDemand: number;
            efficiency: number; // %
            costToday: number;
            history: number[];
            timeLabels: string[];
        };
        security: {
            accessEvents: Array<{ time: string; location: string; type: string; clearance: string }>;
            breachAttempts: number;
            camerasOnline: number;
            camerasTotal: number;
            lockStatus: Array<{ zone: string; status: 'Locked' | 'Unlocked' | 'Error' }>;
        };
        occupancy: {
            current: number;
            peak: number;
            zones: Array<{ name: string; current: number; capacity: number; utilization: number }>;
            trafficFlow: number[];
            timeLabels: string[];
        };
        maintenance: {
            overdueItems: Array<{ id: string; item: string; dueDate: string; priority: 'Low' | 'Medium' | 'High' | 'Critical' }>;
            scheduledToday: Array<{ time: string; item: string; technician: string }>;
            equipmentHealth: Array<{ equipment: string; status: 'Good' | 'Fair' | 'Poor' | 'Critical'; lastService: string }>;
            workOrders: { open: number; inProgress: number; completed: number };
        };
        atRisk: Array<{
            id: string;
            category: 'Energy' | 'Security' | 'Safety' | 'Equipment' | 'Compliance';
            issue: string;
            severity: 'Low' | 'Medium' | 'High' | 'Critical';
            impact: string;
            dueDate: string;
        }>;
    };
}

// Utility functions
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function randi(min: number, max: number) { return Math.floor(rand(min, max + 1)); }
function pick<T>(arr: T[]): T { return arr[randi(0, arr.length - 1)]; }

function generateTimeLabels(hours = 24) {
    const labels = [];
    for (let i = hours - 1; i >= 0; i--) {
        const dt = new Date(Date.now() - i * 3600 * 1000);
        labels.push(dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
}

function generateSeries(base: number, variance: number, count: number, min?: number, max?: number) {
    const data = [];
    let v = base;
    for (let i = 0; i < count; i++) {
        v += rand(-variance, variance);
        if (min !== undefined) v = Math.max(min, v);
        if (max !== undefined) v = Math.min(max, v);
        data.push(Number(v.toFixed(2)));
    }
    return data;
}

export function generateHawkProData(): HawkProData {
    const timeLabels = generateTimeLabels(24);
    const batteryLevel = randi(20, 95);
    const gpsLat = 42.5145 + rand(-0.01, 0.01);
    const gpsLng = -83.0146 + rand(-0.01, 0.01);

    return {
        executive: {
            deviceStatus: pick(['online', 'online', 'online', 'offline'] as const),
            batteryLevel,
            batteryCharging: pick([true, false, false]),
            connectivity: pick(['LTE-M', 'NB-IoT'] as const),
            lastSync: new Date(Date.now() - randi(1, 15) * 60 * 1000).toLocaleTimeString(),
            activeAlerts: randi(0, 5),
            lastGPSFix: new Date(Date.now() - randi(1, 10) * 60 * 1000).toLocaleTimeString(),
            healthScore: randi(75, 99),
        },

        deviceHealth: {
            batteryVoltage: rand(3.4, 4.2),
            powerSource: pick(['Battery', 'Solar', 'External', 'Hybrid'] as const),
            signalStrength: randi(-115, -70),
            internalTemp: rand(25, 45),
            memoryUsage: randi(35, 85),
            firmwareVersion: `v1.${randi(0, 5)}.${randi(0, 20)}`,
            uptime: `${randi(1, 30)}d ${randi(0, 23)}h ${randi(0, 59)}m`,
            lastRebootReason: pick(['Scheduled Update', 'Power Cycle', 'Watchdog Reset', 'Manual Restart']),
            faultCodes: pick([[], [], ['E001: Sensor timeout'], ['W042: Low signal']]),
            healthTimeline: Array.from({ length: 24 }).map((_, i) => ({
                time: timeLabels[i],
                score: randi(70, 100)
            }))
        },

        connectivity: {
            networkType: pick(['LTE-M', 'NB-IoT'] as const),
            carrier: pick(['Robi', 'Grameenphone', 'Banglalink']),
            signalHistory: generateSeries(randi(-110, -75), 8, 24, -120, -60),
            dataUsageUp: generateSeries(rand(1, 5), 1.2, 24, 0, 20),
            dataUsageDown: generateSeries(rand(0.2, 1.5), 0.5, 24, 0, 5),
            packetSuccess: generateSeries(rand(85, 98), 3, 24, 60, 100),
            offlineDuration: Array.from({ length: randi(0, 3) }).map(() => ({
                start: new Date(Date.now() - randi(1, 48) * 3600 * 1000).toLocaleString(),
                end: new Date(Date.now() - randi(0, 24) * 3600 * 1000).toLocaleString(),
                duration: randi(5, 120)
            })),
            timeLabels
        },

        environmental: {
            ambientTemp: generateSeries(rand(24, 32), 2.5, 24, 15, 45),
            internalTemp: generateSeries(rand(28, 38), 2, 24, 20, 50),
            humidity: generateSeries(rand(45, 75), 6, 24, 10, 95),
            pressure: generateSeries(rand(1010, 1020), 3, 24, 980, 1040),
            rainfall: generateSeries(rand(0, 2), 1.5, 24, 0, 50),
            airQuality: generateSeries(rand(50, 150), 20, 24, 0, 500),
            soilTemp: generateSeries(rand(22, 28), 1.5, 24, 15, 35),
            timeLabels,
            thresholds: { min: 18, max: 38 }
        },

        agriculture: {
            soilMoisture: [
                { zone: 'Zone A', value: rand(25, 65), depth: '10cm' },
                { zone: 'Zone A', value: rand(30, 70), depth: '20cm' },
                { zone: 'Zone B', value: rand(20, 60), depth: '10cm' },
                { zone: 'Zone B', value: rand(25, 65), depth: '20cm' },
            ],
            soilPH: generateSeries(rand(6.2, 7.5), 0.3, 24, 5, 8.5),
            electricalConductivity: generateSeries(rand(0.5, 2.5), 0.4, 24, 0, 5),
            irrigationStatus: pick([true, false]),
            rainfallPulses: generateSeries(rand(0, 5), 2, 24, 0, 50),
            cropZones: [
                { name: 'Zone A - North Field', moisture: rand(30, 60), ph: rand(6.5, 7.2), status: 'Optimal' },
                { name: 'Zone B - South Field', moisture: rand(20, 45), ph: rand(6.0, 6.8), status: 'Needs Water' },
                { name: 'Zone C - East Field', moisture: rand(35, 65), ph: rand(6.8, 7.5), status: 'Optimal' },
            ]
        },

        waterUtility: {
            tankLevel: rand(0.5, 3.5),
            tankCapacity: 5.0,
            flowRate: rand(5, 45),
            pressure: rand(1.5, 4.5),
            turbidity: rand(0.5, 15),
            tds: rand(50, 300),
            leakEvents: Array.from({ length: randi(0, 2) }).map(() => ({
                time: new Date(Date.now() - randi(1, 72) * 3600 * 1000).toLocaleString(),
                severity: pick(['Low', 'Medium', 'High'])
            })),
            pumpHistory: Array.from({ length: 12 }).map((_, i) => ({
                time: new Date(Date.now() - (11 - i) * 7200 * 1000).toLocaleTimeString(),
                state: pick(['ON', 'OFF'] as const)
            })),
            flowHistory: generateSeries(rand(10, 35), 8, 24, 0, 80)
        },

        ioCards: [
            {
                id: 'card-1',
                type: 'AgTech1',
                inputs: [
                    { channel: 'A1', sensorType: 'Soil Moisture', rawValue: rand(500, 800), calibratedValue: rand(25, 65), unit: '%', powerConsumption: rand(5, 15), health: 'OK' },
                    { channel: 'A2', sensorType: 'Temperature', rawValue: rand(200, 350), calibratedValue: rand(22, 32), unit: '°C', powerConsumption: rand(3, 8), health: 'OK' },
                ]
            },
            {
                id: 'card-2',
                type: 'RS-1 (Serial)',
                inputs: [
                    { channel: 'RS485', sensorType: 'Modbus Device', rawValue: 0, calibratedValue: rand(100, 500), unit: 'units', powerConsumption: rand(10, 25), health: pick(['OK', 'WARN'] as const) },
                ]
            }
        ],

        gps: {
            currentLat: gpsLat,
            currentLng: gpsLng,
            accuracy: rand(2.5, 8),
            movementHistory: Array.from({ length: 15 }).map((_, i) => ({
                lat: gpsLat + rand(-0.003, 0.003),
                lng: gpsLng + rand(-0.003, 0.003),
                time: new Date(Date.now() - (14 - i) * 20 * 60 * 1000).toLocaleTimeString(),
                speed: rand(0, 50)
            })),
            speed: rand(0, 45),
            geofenceStatus: pick(['Inside', 'Inside', 'Inside', 'Outside'] as const),
            tamperEvents: []
        },

        automation: {
            activeRules: [
                { id: 'r1', name: 'Irrigation Control', condition: 'soil_moisture < 30%', action: 'Turn ON pump', enabled: true, lastTriggered: new Date(Date.now() - randi(10, 120) * 60 * 1000).toLocaleString() },
                { id: 'r2', name: 'High Water Alert', condition: 'tank_level > 4.5m', action: 'Send SMS alert', enabled: true, lastTriggered: 'Never' },
                { id: 'r3', name: 'Battery Low', condition: 'battery < 20%', action: 'Email notification', enabled: true, lastTriggered: 'Never' },
            ],
            triggerHistory: Array.from({ length: 10 }).map((_, i) => ({
                time: new Date(Date.now() - randi(5, 240) * 60 * 1000).toLocaleString(),
                rule: pick(['Irrigation Control', 'High Water Alert', 'Temperature Warning']),
                result: pick(['Success', 'Success', 'Success', 'Failed'])
            })),
            failedTasks: [],
            executionLatency: generateSeries(rand(50, 200), 40, 24, 10, 500)
        },

        alerts: {
            active: [
                { id: 'a1', severity: 'Critical' as const, message: 'Battery voltage critically low (3.2V)', timestamp: new Date(Date.now() - randi(5, 30) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'SMS + Email' },
                { id: 'a2', severity: 'High' as const, message: 'Soil moisture below threshold in Zone B', timestamp: new Date(Date.now() - randi(15, 60) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'SMS' },
                { id: 'a3', severity: 'High' as const, message: 'Signal strength poor (-115 dBm)', timestamp: new Date(Date.now() - randi(10, 45) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'Push' },
                { id: 'a4', severity: 'Medium' as const, message: 'Internal temperature above 45°C', timestamp: new Date(Date.now() - randi(20, 90) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'Email' },
                { id: 'a5', severity: 'Medium' as const, message: 'Water tank level at 85% capacity', timestamp: new Date(Date.now() - randi(30, 120) * 60 * 1000).toLocaleString(), acknowledged: true, channel: 'Push' },
                { id: 'a6', severity: 'Low' as const, message: 'Firmware update available (v1.6.0)', timestamp: new Date(Date.now() - randi(60, 240) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'Email' },
                { id: 'a7', severity: 'Critical' as const, message: 'GPS signal lost - location uncertain', timestamp: new Date(Date.now() - randi(5, 20) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'SMS + Email' },
                { id: 'a8', severity: 'High' as const, message: 'Turbidity exceeds safe limit (12 NTU)', timestamp: new Date(Date.now() - randi(25, 75) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'SMS' },
                { id: 'a9', severity: 'Medium' as const, message: 'Memory usage at 82%', timestamp: new Date(Date.now() - randi(40, 150) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'Push' },
                { id: 'a10', severity: 'Low' as const, message: 'Scheduled maintenance due in 7 days', timestamp: new Date(Date.now() - randi(120, 300) * 60 * 1000).toLocaleString(), acknowledged: true, channel: 'Email' },
                { id: 'a11', severity: 'High' as const, message: 'Pump failed to start - check power', timestamp: new Date(Date.now() - randi(8, 35) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'SMS + Email' },
                { id: 'a12', severity: 'Medium' as const, message: 'Rainfall sensor calibration needed', timestamp: new Date(Date.now() - randi(50, 180) * 60 * 1000).toLocaleString(), acknowledged: false, channel: 'Push' },
            ].filter(() => Math.random() > 0.3), // Show ~70% of alerts randomly
            resolved: Array.from({ length: 5 }).map((_, i) => ({
                id: `r${i}`,
                resolvedAt: new Date(Date.now() - randi(1, 48) * 3600 * 1000).toLocaleString(),
                resolutionTime: randi(5, 120)
            }))
        },

        analytics: {
            longTermTrends: Array.from({ length: 30 }).map((_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 3600 * 1000).toLocaleDateString(),
                avgTemp: rand(25, 35),
                avgHumidity: rand(50, 80),
                avgSoil: rand(30, 60)
            })),
            anomalies: [],
            correlations: [
                { metric1: 'Temperature', metric2: 'Humidity', correlation: -0.72 },
                { metric1: 'Rainfall', metric2: 'Soil Moisture', correlation: 0.85 },
            ]
        },

        configuration: {
            samplingRate: pick(['1 min', '5 min', '10 min', '30 min']),
            uploadInterval: pick(['5 min', '15 min', '30 min', '1 hour']),
            powerProfile: pick(['Low Power', 'Balanced', 'High Performance']),
            sensorCalibration: [
                { sensor: 'Soil Moisture A1', offset: rand(-2, 2), scale: rand(0.95, 1.05) },
                { sensor: 'Temperature A2', offset: rand(-1, 1), scale: 1.0 },
            ],
            otaStatus: pick(['Idle', 'Downloading', 'Installing', 'Complete']),
            otaProgress: randi(0, 100)
        },

        security: {
            encryptionEnabled: true,
            authLogs: Array.from({ length: 10 }).map(() => ({
                time: new Date(Date.now() - randi(1, 168) * 3600 * 1000).toLocaleString(),
                user: pick(['admin@company.com', 'API Service', 'Mobile App']),
                action: pick(['Login', 'Config Change', 'Data Export', 'Device Restart']),
                result: pick(['Success', 'Success', 'Success', 'Failed'])
            })),
            accessHistory: [],
            integrityChecks: [
                { component: 'Firmware', status: 'OK' },
                { component: 'Configuration', status: 'OK' },
                { component: 'Data Storage', status: 'OK' },
            ],
            complianceFlags: []
        },

        fleet: {
            devices: Array.from({ length: 8 }).map((_, i) => ({
                id: `HAWK-${100000 + i}`,
                name: `Sensor Hub ${i + 1}`,
                status: pick(['online', 'online', 'online', 'offline'] as const),
                battery: randi(20, 95),
                signal: randi(-110, -70),
                location: { lat: gpsLat + rand(-0.05, 0.05), lng: gpsLng + rand(-0.05, 0.05) },
                lastSeen: new Date(Date.now() - randi(1, 120) * 60 * 1000).toLocaleString()
            })),
            regionalSummary: [
                { region: 'North Zone', online: randi(3, 8), offline: randi(0, 2) },
                { region: 'South Zone', online: randi(2, 6), offline: randi(0, 1) },
                { region: 'East Zone', online: randi(4, 9), offline: randi(0, 3) },
            ]
        },

        construction: {
            portfolio: {
                totalBuildings: 12,
                onlineBuildings: randi(10, 12),
                overallScore: randi(75, 95),
                criticalIssues: randi(0, 3)
            },
            buildings: Array.from({ length: 12 }).map((_, i) => ({
                id: `BLD-${1000 + i}`,
                name: pick(['HQ Tower', 'East Wing', 'West Wing', 'Manufacturing Plant A', 'Warehouse B', 'Office Complex C', 'Research Lab D', 'Data Center E', 'Storage Facility F', 'Admin Building G', 'Maintenance Hub H', 'Parking Structure I'])[i] || `Building ${i + 1}`,
                status: pick(['operational', 'operational', 'operational', 'warning', 'critical', 'offline'] as const),
                occupancy: randi(50, 450),
                maxOccupancy: 500,
                energyScore: randi(65, 98),
                securityScore: randi(80, 100),
                maintenanceScore: randi(70, 95)
            })),
            energyPerformance: {
                currentUsage: rand(850, 1250),
                peakDemand: rand(1400, 1800),
                efficiency: randi(78, 94),
                costToday: rand(2500, 4500),
                history: generateSeries(1000, 100, 24, 600, 1500),
                timeLabels
            },
            security: {
                accessEvents: Array.from({ length: 15 }).map(() => ({
                    time: new Date(Date.now() - randi(1, 480) * 60 * 1000).toLocaleTimeString(),
                    location: pick(['Main Entrance', 'Loading Dock', 'Parking Garage', 'Executive Floor', 'Server Room', 'Manufacturing Floor']),
                    type: pick(['Badge Scan', 'PIN Entry', 'Biometric', 'Security Override']),
                    clearance: pick(['Authorized', 'Authorized', 'Authorized', 'Denied'])
                })),
                breachAttempts: randi(0, 3),
                camerasOnline: randi(142, 150),
                camerasTotal: 150,
                lockStatus: [
                    { zone: 'Main Entrance', status: pick(['Locked', 'Unlocked'] as const) },
                    { zone: 'Server Room', status: 'Locked' as const },
                    { zone: 'Executive Wing', status: 'Locked' as const },
                    { zone: 'Loading Dock', status: pick(['Locked', 'Unlocked'] as const) },
                    { zone: 'Emergency Exits', status: pick(['Locked', 'Error'] as const) }
                ]
            },
            occupancy: {
                current: randi(1200, 2800),
                peak: 3500,
                zones: [
                    { name: 'Manufacturing Floor', current: randi(200, 450), capacity: 500, utilization: 0 },
                    { name: 'Office Block A', current: randi(150, 350), capacity: 400, utilization: 0 },
                    { name: 'Office Block B', current: randi(100, 280), capacity: 350, utilization: 0 },
                    { name: 'Executive Wing', current: randi(20, 80), capacity: 100, utilization: 0 },
                    { name: 'Cafeteria', current: randi(50, 200), capacity: 300, utilization: 0 },
                    { name: 'Conference Center', current: randi(30, 150), capacity: 250, utilization: 0 }
                ].map(zone => ({ ...zone, utilization: Math.round((zone.current / zone.capacity) * 100) })),
                trafficFlow: generateSeries(150, 30, 24, 20, 400),
                timeLabels
            },
            maintenance: {
                overdueItems: [
                    { id: 'M001', item: 'HVAC Filter Replacement - Floor 3', dueDate: '2 days ago', priority: 'High' as const },
                    { id: 'M002', item: 'Fire Suppression System Inspection', dueDate: '5 days ago', priority: 'Critical' as const },
                    { id: 'M003', item: 'Elevator Safety Check - Tower B', dueDate: '1 day ago', priority: 'High' as const },
                    { id: 'M004', item: 'Emergency Lighting Test', dueDate: '3 days ago', priority: 'Medium' as const }
                ].filter(() => Math.random() > 0.3),
                scheduledToday: [
                    { time: '09:00 AM', item: 'Roof Inspection', technician: 'John Smith' },
                    { time: '11:30 AM', item: 'Boiler Maintenance', technician: 'Sarah Lee' },
                    { time: '02:00 PM', item: 'Security System Upgrade', technician: 'Mike Johnson' },
                    { time: '04:15 PM', item: 'Parking Gate Repair', technician: 'David Chen' }
                ],
                equipmentHealth: [
                    { equipment: 'Chiller Unit A', status: pick(['Good', 'Fair', 'Poor'] as const), lastService: '15 days ago' },
                    { equipment: 'Boiler System', status: pick(['Good', 'Fair'] as const), lastService: '8 days ago' },
                    { equipment: 'Generator Backup', status: 'Good' as const, lastService: '22 days ago' },
                    { equipment: 'HVAC Zone 1', status: pick(['Good', 'Fair', 'Poor'] as const), lastService: '45 days ago' },
                    { equipment: 'Fire Pump', status: pick(['Critical', 'Poor'] as const), lastService: '62 days ago' },
                    { equipment: 'Elevator Bank A', status: 'Good' as const, lastService: '12 days ago' }
                ],
                workOrders: {
                    open: randi(8, 25),
                    inProgress: randi(5, 15),
                    completed: randi(45, 120)
                }
            },
            atRisk: [
                { id: 'R001', category: 'Energy' as const, issue: 'Peak demand approaching grid limit', severity: 'High' as const, impact: 'Potential power outage', dueDate: 'Today' },
                { id: 'R002', category: 'Safety' as const, issue: 'Fire suppression system overdue for inspection', severity: 'Critical' as const, impact: 'Code violation, insurance risk', dueDate: '5 days overdue' },
                { id: 'R003', category: 'Equipment' as const, issue: 'Chiller efficiency below 70%', severity: 'Medium' as const, impact: 'Increased energy costs', dueDate: '3 days' },
                { id: 'R004', category: 'Security' as const, issue: '8 cameras offline in parking area', severity: 'High' as const, impact: 'Blind spots in surveillance', dueDate: 'Today' },
                { id: 'R005', category: 'Compliance' as const, issue: 'Annual elevator inspection due', severity: 'Medium' as const, impact: 'Regulatory compliance', dueDate: '7 days' },
                { id: 'R006', category: 'Equipment' as const, issue: 'Fire pump showing critical status', severity: 'Critical' as const, impact: 'Fire safety system failure', dueDate: 'Immediate' }
            ].filter(() => Math.random() > 0.2)
        }
    };
}
