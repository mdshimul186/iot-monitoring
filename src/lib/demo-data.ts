export interface DemoData {
    deviceId: string;
    fw: string;
    connMode: string;
    signalDbm: number;
    lastSeen: string;
    batteryPct: number;
    vbat: number;
    vin: number;
    gps: {
        lat: number;
        lng: number;
        fix: string;
        acc: string;
        speed: number;
        heading: number;
        sats: number;
        hdop: number;
        geofence: string;
    };
    samplingRate: string;
    uploadInterval: string;
    storageUsed: number;
    envLabels: string[];
    tempC: number[];
    hum: number[];
    soil: number[];
    waterM: number[];
    internalTempC: number[];
    accel: { x: number[]; y: number[]; z: number[] };
    turbidity: number[];
    ph: number[];
    analog: Array<{
        ch: string;
        type: string;
        value: number;
        unit: string;
        status: string;
    }>;
    pulse: number[];
    digital: Array<{
        name: string;
        state: number;
        volts: number | null;
        mode: string;
    }>;
    serial: Array<{
        time: string;
        port: string;
        payload: string;
    }>;
    ble: Array<{
        name: string;
        rssi: number;
        battery: number;
        reading: string;
        updated: string;
    }>;
    alerts: Array<{
        sev: string;
        title: string;
        msg: string;
        at: string;
    }>;
    tasks: Array<{
        name: string;
        action: string;
        schedule: string;
        enabled: boolean;
    }>;
    events: Array<{
        time: string;
        type: string;
        msg: string;
        sev: string;
    }>;
    powerOut: Array<{
        label: string;
        value: number;
    }>;
    uptime: Array<{
        day: string;
        pct: number;
    }>;
    ioCards: Array<{
        slot: number;
        name: string;
        type: string;
        status: string;
    }>;
    batteryHistory: Array<{
        time: string;
        percent: number;
        voltage: number;
        charging: boolean;
    }>;
    networkStats: {
        dataUsageMB: number[];
        signalHistory: number[];
        uplinkSuccess: number[];
        labels: string[];
    };
    locationHistory: Array<{
        lat: number;
        lng: number;
        time: string;
        speed: number;
    }>;
    auditLog: Array<{
        timestamp: string;
        action: string;
        user: string;
        result: string;
    }>;
    solarCharging: {
        panelVoltage: number[];
        chargeCurrent: number[];
        chargeState: string;
    };
    compliance: {
        dataPoints: number;
        coverage: number;
        uptime: number;
        lastExport: string;
    };
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function randi(min: number, max: number) { return Math.floor(rand(min, max + 1)); }
function pick<T>(arr: T[]): T { return arr[randi(0, arr.length - 1)]; }
function fmt(n: number, d = 2) { return Number(n).toFixed(d); }
function agoMinutes(m: number) { return new Date(Date.now() - m * 60 * 1000).toISOString(); }

function generateTimeLabels(hours = 24) {
    const labels = [];
    for (let i = hours - 1; i >= 0; i--) {
        const dt = new Date(Date.now() - i * 3600 * 1000);
        labels.push(dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
}

function generateSeries(base: number, variance: number, count: number, clampMin: number | null = null, clampMax: number | null = null) {
    const data = [];
    let v = base;
    for (let i = 0; i < count; i++) {
        v += rand(-variance, variance);
        if (clampMin !== null) v = Math.max(clampMin, v);
        if (clampMax !== null) v = Math.min(clampMax, v);
        data.push(Number(fmt(v, 2)));
    }
    return data;
}

export function generateDemoData(): DemoData {
    const tempC = generateSeries(rand(26, 34), 1.2, 24, 18, 45);
    const hum = generateSeries(rand(35, 70), 4.5, 24, 5, 95);
    const soil = generateSeries(rand(10, 45), 5.5, 24, 0, 100);
    const waterM = generateSeries(rand(0.4, 2.4), 0.25, 24, 0, 4);

    const batteryPct = randi(18, 98);
    const gpsGeofence = pick(["Inside", "Inside", "Inside", "Outside"]);
    const signalDbm = randi(-115, -75);
    const gpsLat = 42.5145 + rand(-0.01, 0.01);
    const gpsLng = -83.0146 + rand(-0.01, 0.01);

    // Alerts logic
    const alerts = [];
    if (Math.max(...tempC) > 38) alerts.push({ sev: "WARN", title: "High Temperature", msg: "Temp exceeded 38°C threshold. Triggered cooling/notification task.", at: agoMinutes(randi(2, 120)) });
    if (Math.min(...hum) < 20) alerts.push({ sev: "WARN", title: "Low Humidity", msg: "Humidity dropped below 20%. Check environment / sensor placement.", at: agoMinutes(randi(2, 200)) });
    if (Math.min(...soil) < 15) alerts.push({ sev: "WARN", title: "Soil Dryness", msg: "Soil moisture below 15%. Irrigation task scheduled.", at: agoMinutes(randi(2, 200)) });
    if (Math.max(...waterM) > 2.2) alerts.push({ sev: "CRIT", title: "High Water Level", msg: "Water level exceeded 2.2m. Flood warning triggered.", at: agoMinutes(randi(2, 60)) });
    if (batteryPct < 25) alerts.push({ sev: "WARN", title: "Battery Low", msg: "Battery under 25%. Consider external power/solar.", at: agoMinutes(randi(5, 180)) });
    if (gpsGeofence === "Outside") alerts.push({ sev: "WARN", title: "Geofence Exit", msg: "Device moved outside expected area.", at: agoMinutes(randi(10, 220)) });
    if (!alerts.length) alerts.push({ sev: "OK", title: "All Clear", msg: "No active alerts at this time.", at: agoMinutes(randi(1, 30)) });

    const serialTypes = ["RS-485", "RS-232", "TTL"];

    return {
        deviceId: "HAWK-" + randi(100000, 999999),
        fw: "v1." + randi(0, 5) + "." + randi(0, 30),
        connMode: pick(["LTE-M", "NB-IoT"]),
        signalDbm,
        lastSeen: new Date().toLocaleString(),
        batteryPct,
        vbat: rand(3.55, 4.15),
        vin: pick([0, rand(6, 28), rand(6, 28), rand(6, 28)]),
        gps: {
            lat: gpsLat,
            lng: gpsLng,
            fix: pick(["3D Fix", "2D Fix", "No Fix"]),
            acc: pick(["~3m", "~5m", "~10m"]),
            speed: rand(0, 45),
            heading: randi(0, 359),
            sats: randi(6, 16),
            hdop: rand(0.6, 2.5),
            geofence: gpsGeofence
        },
        samplingRate: pick(["1 min", "5 min", "10 min", "30 sec"]),
        uploadInterval: pick(["5 min", "15 min", "30 min", "60 min"]),
        storageUsed: randi(4, 92),
        envLabels: generateTimeLabels(24),
        tempC,
        hum,
        soil,
        waterM,
        internalTempC: generateSeries(rand(24, 41), 1.0, 24, -10, 65),
        accel: {
            x: generateSeries(rand(0.02, 0.08), 0.03, 24, 0, 0.35),
            y: generateSeries(rand(0.02, 0.08), 0.03, 24, 0, 0.35),
            z: generateSeries(rand(0.90, 1.05), 0.07, 24, 0.5, 1.5)
        },
        turbidity: generateSeries(rand(1, 8), 1.2, 24, 0, 50),
        ph: generateSeries(rand(6.6, 7.8), 0.2, 24, 0, 14),
        analog: [
            { ch: "A1", type: "Analog (0-30V)", value: rand(1.2, 12.5), unit: "V", status: pick(["OK", "OK", "WARN"]) },
            { ch: "A2", type: "Analog (0-30V)", value: rand(0.2, 2.8), unit: "V", status: "OK" },
            { ch: "A3", type: "4-20mA", value: rand(4.0, 20.0), unit: "mA", status: pick(["OK", "OK", "OK", "WARN"]) },
            { ch: "A4", type: "4-20mA", value: rand(4.0, 20.0), unit: "mA", status: pick(["OK", "OK", "CRIT"]) },
            { ch: "A5", type: "Analog (0-30V)", value: rand(0.0, 30.0), unit: "V", status: "OK" }
        ],
        pulse: generateSeries(rand(10, 90), 12, 24, 0, 220),
        digital: Array.from({ length: 6 }).map((_, i) => ({
            name: "DI" + (i + 1),
            state: pick([0, 1, 1, 0, 1]),
            volts: rand(0, 40),
            mode: pick(["Input", "Input", "Pulse", "Input"]),
        } as { name: string; state: number; volts: number | null; mode: string })).concat([
            { name: "DO1", state: pick([0, 1, 0]), volts: null, mode: "Switched Ground (Output)" }
        ]),
        serial: Array.from({ length: 6 }).map((_) => {
            const t = pick(serialTypes);
            return {
                time: new Date(Date.now() - randi(2, 180) * 60 * 1000).toLocaleTimeString(),
                port: t,
                payload: pick([
                    "SENSOR=FLOW;RATE=" + fmt(rand(2.1, 15.8), 2) + ";UNIT=L/min",
                    "MODBUS:0x01 0x03 REG=0x0010 VAL=" + randi(100, 980),
                    "LEVEL=" + fmt(rand(0.2, 2.8), 2) + "m;TEMP=" + fmt(rand(18, 39), 1),
                    "STATUS=OK;ERR=0;RSSI=" + randi(-110, -75),
                    "PH=" + fmt(rand(6.5, 8.2), 2) + ";TURB=" + fmt(rand(0.5, 10), 1)
                ])
            };
        }).sort((a, b) => a.time.localeCompare(b.time)),
        ble: Array.from({ length: 5 }).map((_) => ({
            name: pick(["BLE-TempTag", "BLE-HumidityTag", "BLE-SoilProbe", "BLE-AssetTag", "BLE-Beacon"]) + "-" + randi(10, 99),
            rssi: randi(-98, -45),
            battery: randi(35, 98),
            reading: pick([
                "Temp " + fmt(rand(15, 38), 1) + "°C",
                "Humidity " + randi(20, 90) + "%",
                "Soil " + randi(5, 60) + "%",
                "Vibration " + fmt(rand(0.02, 0.33), 2) + "g",
                "Door " + pick(["Open", "Closed"])
            ]),
            updated: new Date(Date.now() - randi(1, 25) * 60 * 1000).toLocaleTimeString()
        })),
        alerts,
        tasks: [
            { name: "Threshold: Water Level > 2.2m", action: "Send CRIT alert + push webhook", schedule: "Event-driven", enabled: true },
            { name: "Irrigation Assist", action: "If soil < 15%, turn DO1 ON for 5m", schedule: "Event-driven", enabled: pick([true, true, false]) },
            { name: "Daily Summary", action: "Upload daily report + store metrics", schedule: "Every 24h", enabled: true },
            { name: "Power Saving", action: "Gate sensor power when battery < 20%", schedule: "Event-driven", enabled: true }
        ],
        events: Array.from({ length: 48 }).map((_) => ({
            time: new Date(Date.now() - randi(5, 24 * 60) * 60 * 1000 / 60).toLocaleString(),
            type: pick(["SENSOR", "GPS", "POWER", "CONNECT", "OTA", "TASK"]),
            msg: pick([
                "Uploaded batch successfully",
                "Stored offline record (no coverage)",
                "GPS fix updated",
                "Sensor power switched ON",
                "Sensor power switched OFF",
                "Threshold crossed, task triggered",
                "Webhook delivered (200 OK)",
                "TCP direct send completed",
                "Signal drop detected, retrying",
                "Battery low warning",
                "Firmware download started",
                "Firmware install complete",
                "Device restart requested"
            ]),
            sev: pick(["INFO", "INFO", "INFO", "WARN", "CRIT"])
        })),
        powerOut: [
            { label: "3.3V Sensor Rail", value: rand(20, 160) },
            { label: "5V Sensor Rail", value: rand(10, 220) },
            { label: "12V Sensor Rail", value: rand(0, 350) },
            { label: "DO1 Load (mA)", value: rand(0, 900) }
        ],
        uptime: Array.from({ length: 7 }).map((_, i) => ({
            day: new Date(Date.now() - (6 - i) * 24 * 3600 * 1000).toLocaleDateString([], { weekday: "short" }),
            pct: rand(92, 100)
        })),
        ioCards: [
            { slot: 1, name: "Cellular Modem (LTE-M)", type: "Comms", status: "Active" },
            { slot: 2, name: "GPS / GNSS Module", type: "Pos", status: "Active" },
            { slot: 3, name: "Analog Input Card (8-ch)", type: "I/O", status: "OK" },
            { slot: 4, name: "Digital I/O Card", type: "I/O", status: "OK" }
        ],
        batteryHistory: Array.from({ length: 24 }).map((_, i) => ({
            time: new Date(Date.now() - (23 - i) * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            percent: Math.max(18, batteryPct - randi(0, 15) + (i * 0.5)),
            voltage: rand(3.4, 4.2),
            charging: pick([false, false, false, true])
        })),
        networkStats: {
            dataUsageMB: generateSeries(rand(2, 8), 1.5, 24, 0, 50),
            signalHistory: generateSeries(signalDbm, 5, 24, -120, -70),
            uplinkSuccess: generateSeries(rand(85, 98), 3, 24, 60, 100),
            labels: generateTimeLabels(24)
        },
        locationHistory: Array.from({ length: 10 }).map((_, i) => ({
            lat: gpsLat + rand(-0.002, 0.002),
            lng: gpsLng + rand(-0.002, 0.002),
            time: new Date(Date.now() - (9 - i) * 15 * 60 * 1000).toLocaleTimeString(),
            speed: rand(0, 45)
        })),
        auditLog: Array.from({ length: 15 }).map((_, i) => ({
            timestamp: new Date(Date.now() - randi(1, 72) * 3600 * 1000).toLocaleString(),
            action: pick([
                "Configuration updated",
                "Firmware OTA initiated",
                "Device reboot requested",
                "Sensor threshold modified",
                "Data export completed",
                "Task schedule changed",
                "User login",
                "API key regenerated"
            ]),
            user: pick(["admin@company.com", "operator@company.com", "API Service", "Scheduled Task"]),
            result: pick(["Success", "Success", "Success", "Failed"])
        })),
        solarCharging: {
            panelVoltage: generateSeries(rand(12, 18), 1.2, 24, 0, 22),
            chargeCurrent: generateSeries(rand(100, 500), 80, 24, 0, 800),
            chargeState: pick(["Charging", "Float", "Idle", "MPPT"])
        },
        compliance: {
            dataPoints: randi(15000, 95000),
            coverage: rand(92, 99.9),
            uptime: rand(96, 99.99),
            lastExport: new Date(Date.now() - randi(1, 48) * 3600 * 1000).toLocaleDateString()
        }
    };
}
