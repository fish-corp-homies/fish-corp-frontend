'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';

type TimeInterval = 'today' | 'tomorrow' | '48h' | 'week';

const INTERVAL_LABELS: Record<TimeInterval, string> = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    '48h': '48 Hours',
    week: 'A Week',
};

function getIntervalRange(interval: TimeInterval): [Date, Date] {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    switch (interval) {
        case 'today': return [now, midnight];
        case 'tomorrow': {
            const end = new Date(midnight);
            end.setDate(end.getDate() + 1);
            return [midnight, end];
        }
        case '48h': return [now, new Date(now.getTime() + 48 * 60 * 60 * 1000)];
        case 'week':  return [now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)];
    }
}
import { getOceanData, getTidalData, getSunrise, getWeatherForecast, OceanData, TideForecastEntry, SunData, WeatherForecastData } from '@/lib/api';
import SectionPanel from '@/components/SectionPanel';
import MapControls from '@/components/map/MapControls';
import AtAGlance from '@/components/map/AtAGlance';
import OceanConditions from '@/components/map/OceanConditions';
import WeatherForecast from '@/components/map/WeatherForecast';
import TidalForecast from '@/components/map/TidalForecast';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="outer-border">
            <div className="inner-border p-4 text-center text-sm">Loading map...</div>
        </div>
    ),
});

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
    const [interval, setInterval] = useState<TimeInterval>('48h');
    const [startTime, endTime] = useMemo(() => getIntervalRange(interval), [interval]);

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
                handleFetch(coords);
            },
            () => {
                setError('Could not get your location. Check browser permissions.');
                setLocating(false);
                setSelectedPosition(null);
                setOceanData(null);
                setTidalData(null);
                setSunData(null);
                setWeatherData(null);
            },
        );
    }

    async function handleFetch(coords?: [number, number]) {
        const position = coords ?? selectedPosition;
        if (!position) return;
        setLoading(true);
        setError(null);
        try {
            const [oceanResult, tidalResult, sunResult, weatherResult] = await Promise.allSettled([
                getOceanData(position[0], position[1]),
                getTidalData(position[0], position[1]),
                getSunrise(position[0], position[1]),
                getWeatherForecast(position[0], position[1]),
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

    return (
        <div className="m-4 mb-20">
            <SectionPanel title="🗺️ Map — click to select a location" className="mb-4">
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
            </SectionPanel>

            <MapControls
                selectedPosition={selectedPosition}
                loading={loading}
                locating={locating}
                onMyLocation={handleMyLocation}
                onFetch={() => handleFetch()}
            />

            <div className="outer-border mb-4">
                <div className="inner-border px-4 py-3 flex flex-wrap items-center gap-2">
                    {(Object.keys(INTERVAL_LABELS) as TimeInterval[]).map(opt => (
                        <div
                            key={opt}
                            className={`${interval === opt ? 'pressed-outer-border' : 'outer-border'} cursor-pointer select-none`}
                            onClick={() => setInterval(opt)}
                        >
                            <div className={`${interval === opt ? 'pressed-inner-border' : 'inner-border'} px-3 py-1 text-xs font-bold`}>
                                {INTERVAL_LABELS[opt]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AtAGlance
                currentDetails={currentDetails}
                lastTide={lastTide}
                nextTides={nextTides}
                sunData={sunData}
            />

            {error && (
                <div className="outer-border mb-4">
                    <div className="inner-border px-4 py-3">
                        <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm mb-2 -mx-4 -mt-3">Error</div>
                        <p className="text-sm text-red-700 mt-2">{error}</p>
                    </div>
                </div>
            )}

            <OceanConditions
                currentDetails={currentDetails}
                currentTime={currentEntry?.time}
                selectedPosition={selectedPosition}
                oceanData={oceanData}
                startTime={startTime}
                endTime={endTime}
            />

            <WeatherForecast weatherData={weatherData} startTime={startTime} endTime={endTime} />

            <TidalForecast tidalData={tidalData} startTime={startTime} endTime={endTime} />
        </div>
    );
}
