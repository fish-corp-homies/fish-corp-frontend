'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import RetroButton from '@/components/RetroButton';
import { getOceanData, getTidalData, TideForecastEntry } from '@/lib/api';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="outer-border">
            <div className="inner-border p-4 text-center text-sm">Loading map...</div>
        </div>
    ),
});

interface OceanDetails {
    sea_water_temperature?: number;
    sea_surface_wave_height?: number;
    sea_surface_wave_from_direction?: number;
    sea_water_speed?: number;
    sea_water_to_direction?: number;
}

interface OceanData {
    geometry?: {
        coordinates: [number, number];
    };
    properties?: {
        timeseries?: Array<{
            time: string;
            data: {
                instant: {
                    details: OceanDetails;
                };
            };
        }>;
    };
    detail?: string;
}

const CONDITION_LABELS: { key: keyof OceanDetails; label: string; unit: string }[] = [
    { key: 'sea_water_temperature', label: 'Water Temperature', unit: '°C' },
    { key: 'sea_surface_wave_height', label: 'Wave Height', unit: 'm' },
    { key: 'sea_surface_wave_from_direction', label: 'Wave Direction', unit: '°' },
    { key: 'sea_water_speed', label: 'Current Speed', unit: 'm/s' },
    { key: 'sea_water_to_direction', label: 'Current Direction', unit: '°' },
];

export default function Page() {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
    const [oceanData, setOceanData] = useState<OceanData | null>(null);
    const [tidalData, setTidalData] = useState<TideForecastEntry[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleLocationSelect(lat: number, lon: number) {
        setSelectedPosition([lat, lon]);
    }

    async function handleFetch() {
        if (!selectedPosition) return;
        setLoading(true);
        setError(null);
        try {
            const [oceanResult, tidalResult] = await Promise.allSettled([
                getOceanData(selectedPosition[0], selectedPosition[1]),
                getTidalData(selectedPosition[0], selectedPosition[1]),
            ]);

            if (oceanResult.status === 'fulfilled') {
                const data: OceanData = oceanResult.value;
                if (data.detail) {
                    setError(data.detail);
                } else {
                    setOceanData(data);
                }
            } else {
                setError('Failed to fetch ocean data. Try again.');
            }

            if (tidalResult.status === 'fulfilled') {
                setTidalData(tidalResult.value);
            }
        } finally {
            setLoading(false);
        }
    }

    const currentEntry = oceanData?.properties?.timeseries?.[0];
    const currentDetails = currentEntry?.data?.instant?.details;

    return (
        <div className="m-4 mb-20">
            <div className="outer-border mb-4">
                <div className="inner-border p-0 overflow-hidden">
                    <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                        Map — click to select a location
                    </div>
                    <MapComponent
                        onLocationSelect={handleLocationSelect}
                        selectedPosition={selectedPosition}
                        apiPosition={
                            oceanData?.geometry
                                ? [oceanData.geometry.coordinates[1], oceanData.geometry.coordinates[0]]
                                : null
                        }
                    />
                </div>
            </div>

            <div className="outer-border mb-4">
                <div className="inner-border px-4 py-3 flex flex-wrap items-center gap-4">
                    {selectedPosition ? (
                        <span className="text-sm">
                            <strong>Selected:</strong> {selectedPosition[0].toFixed(4)}°N, {selectedPosition[1].toFixed(4)}°E
                        </span>
                    ) : (
                        <span className="text-sm text-gray-600">No location selected — click on the map</span>
                    )}
                    <RetroButton onClick={handleFetch} padding="px-6 py-1">
                        {loading ? 'Fetching...' : 'Get Conditions'}
                    </RetroButton>
                </div>
            </div>

            {error && (
                <div className="outer-border mb-4">
                    <div className="inner-border px-4 py-3">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm mb-2 -mx-4 -mt-3">Error</div>
                        <p className="text-sm text-red-700 mt-2">{error}</p>
                    </div>
                </div>
            )}

            {currentDetails && (
                <div className="outer-border mb-4">
                    <div className="inner-border p-0 overflow-hidden">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                            Ocean Conditions — {new Date(currentEntry!.time).toLocaleString()}
                        </div>
                        <div className="p-4 pb-0 text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <span className="font-bold">Requested:</span>{' '}
                                {selectedPosition![0].toFixed(4)}°N, {selectedPosition![1].toFixed(4)}°E
                            </div>
                            <div>
                                <span className="font-bold">API location:</span>{' '}
                                {oceanData!.geometry!.coordinates[1].toFixed(4)}°N, {oceanData!.geometry!.coordinates[0].toFixed(4)}°E
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {CONDITION_LABELS.map(({ key, label, unit }) => {
                                const value = currentDetails[key];
                                if (value === undefined) return null;
                                return (
                                    <div key={key} className="outer-border">
                                        <div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">{label}</div>
                                            <div className="font-bold text-lg">
                                                {typeof value === 'number' ? value.toFixed(1) : value} {unit}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {tidalData && tidalData.length > 0 && (
                <div className="outer-border">
                    <div className="inner-border p-0 overflow-hidden">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                            Tidal Forecast
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart
                                    data={tidalData.map(e => ({
                                        label: new Date(e.dateTime).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
                                            + ' ' + new Date(e.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                                        height: e.measurement.value,
                                    }))}
                                    margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 9, fill: '#374151' }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 9, fill: '#374151' }}
                                        unit=" cm"
                                        width={52}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#9CA3AF', border: '2px solid #4B5563', fontSize: 12 }}
                                        formatter={(v: number) => [`${v.toFixed(1)} cm`, 'Height']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="height"
                                        stroke="#1E40AF"
                                        fill="#BFDBFE"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: '#1E40AF', strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="px-4 pb-4 overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-blue-900 text-white text-xs">
                                        <th className="text-left px-3 py-1 font-bold">Status</th>
                                        <th className="text-left px-3 py-1 font-bold">Date</th>
                                        <th className="text-left px-3 py-1 font-bold">Time</th>
                                        <th className="text-right px-3 py-1 font-bold">Height</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tidalData.map((entry, i) => {
                                        const dt = new Date(entry.dateTime);
                                        const isHigh = entry.status.toLowerCase() === 'high';
                                        return (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-gray-300' : 'bg-gray-400'}>
                                                <td className="px-3 py-1">
                                                    <span className={`font-bold ${isHigh ? 'text-blue-900' : 'text-gray-600'}`}>
                                                        {isHigh ? '▲' : '▼'} {isHigh ? 'High' : 'Low'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-1 text-xs">
                                                    {dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="px-3 py-1 text-xs">
                                                    {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-3 py-1 text-right font-mono font-bold">
                                                    {entry.measurement.value.toFixed(1)} {entry.measurement.unit}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
