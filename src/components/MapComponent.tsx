'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const TILE_LAYERS = {
    nautical: {
        url: 'https://cache.kartverket.no/v1/wmts/1.0.0/sjokartraster/default/webmercator/{z}/{y}/{x}.png',
        attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
        label: 'Sea chart',
    },
    street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        label: 'Street map',
    },
} as const;

type TileLayerKey = keyof typeof TILE_LAYERS;

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

function FlyToHandler({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, Math.max(map.getZoom(), 10));
    }, [position, map]);
    return null;
}

interface MapComponentProps {
    onLocationSelect: (lat: number, lon: number) => void;
    selectedPosition: [number, number] | null;
    apiPosition: [number, number] | null;
    flyToPosition: [number, number] | null;
}

export default function MapComponent({ onLocationSelect, selectedPosition, apiPosition, flyToPosition }: MapComponentProps) {
    const [activeLayer, setActiveLayer] = useState<TileLayerKey>('nautical');
    const layer = TILE_LAYERS[activeLayer];

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setActiveLayer(activeLayer === 'nautical' ? 'street' : 'nautical')}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    padding: '6px 12px',
                    background: 'white',
                    border: '2px solid rgba(0,0,0,0.2)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    boxShadow: '0 1px 5px rgba(0,0,0,0.15)',
                }}
            >
                {activeLayer === 'nautical' ? 'Street map' : 'Sea chart'}
            </button>
            <MapContainer
                center={[65, 15]}
                zoom={5}
                style={{ height: 'clamp(250px, 50vh, 500px)', width: '100%', cursor: 'crosshair' }}
            >
                <TileLayer key={activeLayer} attribution={layer.attribution} url={layer.url} />
                <ClickHandler onLocationSelect={onLocationSelect} />
                <FlyToHandler position={flyToPosition} />
                {selectedPosition && (
                    <Marker position={selectedPosition} icon={selectedIcon} />
                )}
                {apiPosition && (
                    <Marker position={apiPosition} icon={apiIcon} />
                )}
            </MapContainer>
        </div>
    );
}
