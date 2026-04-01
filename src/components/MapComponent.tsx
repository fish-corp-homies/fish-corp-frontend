'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

const selectedIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const apiIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 22 12.5 41 12.5 41C12.5 41 25 22 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#e53e3e" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12.5" cy="12.5" r="5" fill="white"/>
    </svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: '',
});

interface ClickHandlerProps {
    onLocationSelect: (lat: number, lon: number) => void;
}

function ClickHandler({ onLocationSelect }: ClickHandlerProps) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

interface MapComponentProps {
    onLocationSelect: (lat: number, lon: number) => void;
    selectedPosition: [number, number] | null;
    apiPosition: [number, number] | null;
}

export default function MapComponent({ onLocationSelect, selectedPosition, apiPosition }: MapComponentProps) {
    return (
        <MapContainer
            center={[65, 15]}
            zoom={5}
            style={{ height: '500px', width: '100%', cursor: 'crosshair' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onLocationSelect={onLocationSelect} />
            {selectedPosition && (
                <Marker position={selectedPosition} icon={selectedIcon} />
            )}
            {apiPosition && (
                <Marker position={apiPosition} icon={apiIcon} />
            )}
        </MapContainer>
    );
}
