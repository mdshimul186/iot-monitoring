"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix Leaflet icon issue in Next.js
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
//   iconUrl: require("leaflet/dist/images/marker-icon.png").default,
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
// });

// Use a simple circle marker if we don't want to deal with assets, or just standard markers.
// For this demo, let's use a CircleMarker which looks modern.

export default function MapComponent({ lat, lng }: { lat: number; lng: number }) {
    const [position, setPosition] = useState<[number, number]>([lat, lng]);

    useEffect(() => {
        setPosition([lat, lng]);
    }, [lat, lng]);

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker center={position} radius={10} color="#0f172a" fillColor="#3b82f6" fillOpacity={0.8}>
                <Popup>
                    Device Location<br />
                    Lat: {lat.toFixed(5)}<br />
                    Lng: {lng.toFixed(5)}
                </Popup>
            </CircleMarker>
        </MapContainer>
    );
}
