'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
    ComposedChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import RetroButton from '@/components/RetroButton';
import { getOceanData, getTidalData, getSunrise, getWeatherForecast, TideForecastEntry, SunData, WeatherForecastData } from '@/lib/api';

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
    const [sunData, setSunData] = useState<SunData | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherForecastData | null>(null);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);
    function handleLocationSelect(lat: number, lon: number) {
        setSelectedPosition([lat, lon]);
    }

    function handleMyLocation() {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setSelectedPosition(coords);
                setFlyToPosition(coords);
                setLocating(false);
            },
            () => {
                setError('Could not get your location. Check browser permissions.');
                setLocating(false);
            },
        );
    }

    async function handleFetch() {
        if (!selectedPosition) return;
        setLoading(true);
        setError(null);
        try {
            const [oceanResult, tidalResult, sunResult, weatherResult] = await Promise.allSettled([
                getOceanData(selectedPosition[0], selectedPosition[1]),
                getTidalData(selectedPosition[0], selectedPosition[1]),
                getSunrise(selectedPosition[0], selectedPosition[1]),
                getWeatherForecast(selectedPosition[0], selectedPosition[1]),
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

            if (tidalResult.status === 'fulfilled') setTidalData(tidalResult.value);
            if (sunResult.status === 'fulfilled') setSunData(sunResult.value);
            if (weatherResult.status === 'fulfilled') setWeatherData(weatherResult.value);
        } finally {
            setLoading(false);
        }
    }

    const currentEntry = oceanData?.properties?.timeseries?.[0];
    const currentDetails = currentEntry?.data?.instant?.details;

    const now = new Date();
    const pastTides = tidalData?.filter(e => new Date(e.dateTime) <= now) ?? [];
    const futureTides = tidalData?.filter(e => new Date(e.dateTime) > now) ?? [];
    const lastTide = pastTides[pastTides.length - 1] ?? null;
    const nextTides = futureTides.slice(0, 2);
    const hasSummary = currentDetails?.sea_water_temperature !== undefined || lastTide || nextTides.length > 0 || sunData !== null;

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
                        flyToPosition={flyToPosition}
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
                    <RetroButton onClick={handleMyLocation} padding="px-4 py-1">
                        {locating ? 'Locating...' : 'My Location'}
                    </RetroButton>
                    <RetroButton onClick={handleFetch} padding="px-6 py-1">
                        {loading ? 'Fetching...' : 'Get Conditions'}
                    </RetroButton>
                </div>
            </div>

            {hasSummary && (
                <div className="outer-border mb-4">
                    <div className="inner-border p-0 overflow-hidden">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                            At a glance
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {currentDetails?.sea_water_temperature !== undefined && (
                                <div className="outer-border h-full">
                                    <div className="inner-border h-full px-3 py-3">
                                        <div className="text-xs text-gray-600">Water Temperature</div>
                                        <div className="font-bold text-2xl leading-tight">
                                            {currentDetails.sea_water_temperature.toFixed(1)}°C
                                        </div>
                                    </div>
                                </div>
                            )}
                            {lastTide && (() => {
                                const isHigh = lastTide.status.toLowerCase() === 'high';
                                const dt = new Date(lastTide.dateTime);
                                return (
                                    <div className="outer-border h-full">
                                        <div className="inner-border h-full px-3 py-3">
                                            <div className="text-xs text-gray-600">Last tide</div>
                                            <div className={`font-bold text-xl leading-tight ${isHigh ? 'text-blue-900' : 'text-gray-600'}`}>
                                                {isHigh ? '▲' : '▼'} {isHigh ? 'High' : 'Low'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                {' · '}{dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="font-mono text-sm">{lastTide.measurement.value.toFixed(1)} {lastTide.measurement.unit}</div>
                                        </div>
                                    </div>
                                );
                            })()}
                            {nextTides.map((tide, i) => {
                                const isHigh = tide.status.toLowerCase() === 'high';
                                const dt = new Date(tide.dateTime);
                                return (
                                    <div key={i} className="outer-border h-full">
                                        <div className="inner-border h-full px-3 py-3">
                                            <div className="text-xs text-gray-600">{i === 0 ? 'Next tide' : 'Then'}</div>
                                            <div className={`font-bold text-xl leading-tight ${isHigh ? 'text-blue-900' : 'text-gray-600'}`}>
                                                {isHigh ? '▲' : '▼'} {isHigh ? 'High' : 'Low'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                {' · '}{dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="font-mono text-sm">{tide.measurement.value.toFixed(1)} {tide.measurement.unit}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {sunData && (
                                <div className="outer-border h-full">
                                    <div className="inner-border h-full px-3 py-3">
                                        <div className="text-xs text-gray-600">Sunrise</div>
                                        <div className="font-bold text-xl leading-tight text-yellow-700">
                                            {new Date(sunData.properties.sunrise.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{sunData.properties.sunrise.azimuth.toFixed(0)}° azimuth</div>
                                    </div>
                                </div>
                            )}
                            {sunData && (
                                <div className="outer-border h-full">
                                    <div className="inner-border h-full px-3 py-3">
                                        <div className="text-xs text-gray-600">Sunset</div>
                                        <div className="font-bold text-xl leading-tight text-orange-700">
                                            {new Date(sunData.properties.sunset.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{sunData.properties.sunset.azimuth.toFixed(0)}° azimuth</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                        {(() => {
                            const tempSeries = (oceanData!.properties?.timeseries ?? [])
                                .slice(0, 48)
                                .map(e => ({
                                    label: new Date(e.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                                        + ' ' + new Date(e.time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                                    temp: e.data.instant.details.sea_water_temperature,
                                }))
                                .filter(e => e.temp !== undefined);
                            if (tempSeries.length === 0) return null;
                            return (
                                <div className="p-4 pt-0">
                                    <div className="outer-border">
                                        <div className="inner-border p-0 overflow-hidden">
                                            <div className="bg-blue-800 text-white font-bold px-2 py-1 text-xs select-none">
                                                Water Temperature — next 48 hours
                                            </div>
                                            <div className="p-2">
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <AreaChart data={tempSeries} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                                                        <XAxis
                                                            dataKey="label"
                                                            tick={{ fontSize: 9, fill: '#374151' }}
                                                            interval="preserveStartEnd"
                                                        />
                                                        <YAxis
                                                            tick={{ fontSize: 9, fill: '#374151' }}
                                                            unit="°C"
                                                            width={40}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ background: '#9CA3AF', border: '2px solid #4B5563', fontSize: 12 }}
                                                            formatter={(v) => [typeof v === 'number' ? `${v.toFixed(1)}°C` : v, 'Temp']}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="temp"
                                                            stroke="#1E40AF"
                                                            fill="#BFDBFE"
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {weatherData && (() => {
                const current = weatherData.properties.timeseries[0];
                const d = current?.data.instant.details;
                const hourlyForecast = weatherData.properties.timeseries
                    .slice(0, 48)
                    .map(e => ({
                        label: new Date(e.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                            + ' ' + new Date(e.time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                        temp: e.data.instant.details.air_temperature,
                        cloudTop: 100 - (e.data.instant.details.cloud_area_fraction ?? 0) * 0.4,
                        cloud: e.data.instant.details.cloud_area_fraction ?? 0,
                        precip: e.data.next_1_hours?.details.precipitation_amount ?? 0,
                    }))
                    .filter(e => e.temp !== undefined);
                return (
                    <div className="outer-border mb-4">
                        <div className="inner-border p-0 overflow-hidden">
                            <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                                Weather Forecast
                            </div>
                            {d && (
                                <div className="p-4 pb-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {d.air_temperature !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Air Temperature</div>
                                            <div className="font-bold text-lg">{d.air_temperature.toFixed(1)} °C</div>
                                        </div></div>
                                    )}
                                    {d.air_pressure_at_sea_level !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Air Pressure</div>
                                            <div className="font-bold text-lg">{d.air_pressure_at_sea_level.toFixed(0)} hPa</div>
                                        </div></div>
                                    )}
                                    {d.wind_speed !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Wind Speed</div>
                                            <div className="font-bold text-lg">{d.wind_speed.toFixed(1)} m/s</div>
                                        </div></div>
                                    )}
                                    {d.wind_from_direction !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Wind Direction</div>
                                            <div className="font-bold text-lg">{d.wind_from_direction.toFixed(0)}°</div>
                                        </div></div>
                                    )}
                                    {d.cloud_area_fraction !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Cloud Cover</div>
                                            <div className="font-bold text-lg">{d.cloud_area_fraction.toFixed(0)}%</div>
                                        </div></div>
                                    )}
                                    {d.relative_humidity !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Humidity</div>
                                            <div className="font-bold text-lg">{d.relative_humidity.toFixed(0)}%</div>
                                        </div></div>
                                    )}
                                    {current?.data.next_1_hours?.details.precipitation_amount !== undefined && (
                                        <div className="outer-border"><div className="inner-border px-3 py-2">
                                            <div className="text-xs text-gray-600">Precipitation (1h)</div>
                                            <div className="font-bold text-lg">{current.data.next_1_hours.details.precipitation_amount.toFixed(1)} mm</div>
                                        </div></div>
                                    )}
                                </div>
                            )}
                            {hourlyForecast.length > 0 && (
                                <div className="p-4">
                                    <div className="outer-border">
                                        <div className="inner-border p-0 overflow-hidden">
                                            <div className="bg-blue-800 text-white font-bold px-2 py-1 text-xs select-none">
                                                Air Temperature & Cloud Cover — next 48 hours
                                            </div>
                                            <div className="p-2" style={{ background: 'linear-gradient(to bottom, #7DD3FC 0%, #BAE6FD 60%, #E0F2FE 100%)' }}>
                                                <ResponsiveContainer width="100%" height={220}>
                                                    <ComposedChart data={hourlyForecast} margin={{ top: 8, right: 44, bottom: 0, left: 0 }}>
                                                        <defs>
                                                            <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#1E293B" stopOpacity={0.9} />
                                                                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.5} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.35)" />
                                                        <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#1E3A5F' }} interval="preserveStartEnd" />
                                                        <YAxis yAxisId="sky" domain={[0, 100]} hide />
                                                        <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 9, fill: '#1E3A5F' }} unit="°C" width={36} />
                                                        <Tooltip
                                                            contentStyle={{ background: '#1E293B', border: '2px solid #475569', fontSize: 12, color: '#F1F5F9' }}
                                                            formatter={(v, name) => {
                                                                if (name === 'cloudTop') return [typeof v === 'number' ? `${((100 - v) / 0.4).toFixed(0)}%` : v, 'Cloud Cover'];
                                                                return [typeof v === 'number' ? `${v.toFixed(1)}°C` : v, 'Air Temp'];
                                                            }}
                                                        />
                                                        <Area yAxisId="sky" type="monotone" dataKey="cloudTop" baseValue={100} fill="url(#cloudGrad)" stroke="rgba(148,163,184,0.4)" strokeWidth={1} />
                                                        <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {tidalData && tidalData.length > 0 && (
                <div className="outer-border">
                    <div className="inner-border p-0 overflow-hidden">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm select-none">
                            Tidal Forecast
                        </div>
                        <div className="p-4">
                            <div className="outer-border">
                            <div className="inner-border p-2">
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart
                                    data={tidalData.map(e => ({
                                        label: new Date(e.dateTime).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
                                            + ' ' + new Date(e.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                                        height: e.measurement.value,
                                    }))}
                                    margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
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
                                        formatter={(v) => [typeof v === 'number' ? `${v.toFixed(1)} cm` : v, 'Height']}
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
                            </div>
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
