'use client';

import { useState } from 'react';
import SectionPanel from '@/components/SectionPanel';
import MetricChart from '@/components/map/MetricChart';
import CollapsibleTable from '@/components/map/CollapsibleTable';
import { WeatherForecastData } from '@/lib/api';
import { degreesToCompass } from '@/lib/direction';
import DirectionArrow from '@/components/DirectionArrow';

type WeatherKey = 'air_temperature' | 'air_pressure_at_sea_level' | 'wind_speed' | 'wind_from_direction' | 'cloud_area_fraction' | 'relative_humidity' | 'precipitation_amount';

interface WeatherConfig {
    key: WeatherKey;
    label: string;
    unit: string;
    color: string;
    fill: string;
    isDirection?: boolean;
    fromDirection?: boolean;
}

const WEATHER_LABELS: WeatherConfig[] = [
    { key: 'air_temperature',          label: '🌡️ Air Temperature',   unit: ' °C',  color: '#F59E0B', fill: '#FEF3C7' },
    { key: 'air_pressure_at_sea_level',label: '🔵 Air Pressure',       unit: ' hPa', color: '#6366F1', fill: '#E0E7FF' },
    { key: 'wind_speed',               label: '💨 Wind Speed',          unit: ' m/s', color: '#10B981', fill: '#D1FAE5' },
    { key: 'wind_from_direction',      label: '💨 Wind Direction',      unit: '°',    color: '#8B5CF6', fill: '#EDE9FE', isDirection: true, fromDirection: true },
    { key: 'cloud_area_fraction',      label: '☁️ Cloud Cover',         unit: '%',    color: '#64748B', fill: '#E2E8F0' },
    { key: 'relative_humidity',        label: '💧 Humidity',            unit: '%',    color: '#0EA5E9', fill: '#E0F2FE' },
    { key: 'precipitation_amount',     label: '🌧️ Precipitation (1h)',  unit: ' mm',  color: '#2563EB', fill: '#BFDBFE' },
];

interface WeatherForecastProps {
    weatherData: WeatherForecastData | null;
}

export default function WeatherForecast({ weatherData }: WeatherForecastProps) {
    const [selectedKey, setSelectedKey] = useState<WeatherKey | null>(null);

    if (!weatherData) return null;

    const current = weatherData.properties.timeseries[0];
    const d = current?.data.instant.details;

    function toggleKey(key: WeatherKey) {
        setSelectedKey(prev => (prev === key ? null : key));
    }

    function getCurrentValue(key: WeatherKey): number | undefined {
        if (key === 'precipitation_amount') return current?.data.next_1_hours?.details.precipitation_amount;
        return d?.[key];
    }

    function getChartData(key: WeatherKey) {
        return weatherData!.properties.timeseries.slice(0, 48).map(e => ({
            time: e.time,
            value: key === 'precipitation_amount'
                ? e.data.next_1_hours?.details.precipitation_amount
                : e.data.instant.details[key],
        }));
    }

    const selected = selectedKey ? WEATHER_LABELS.find(w => w.key === selectedKey) : null;

    return (
        <SectionPanel title="⛅ Weather Forecast" className="mb-4">
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {WEATHER_LABELS.map(({ key, label, unit, isDirection, fromDirection }) => {
                    const value = getCurrentValue(key);
                    if (value === undefined) return null;
                    const isSelected = selectedKey === key;
                    const outerClass = isSelected ? 'pressed-outer-border' : 'outer-border';
                    const innerClass = isSelected ? 'pressed-inner-border' : 'inner-border';
                    const display = isDirection
                        ? <DirectionArrow degrees={value} from={fromDirection} />
                        : `${value.toFixed(key === 'air_pressure_at_sea_level' ? 0 : 1)}${unit}`;
                    return (
                        <div
                            key={key}
                            className={`${outerClass} cursor-pointer select-none`}
                            onClick={() => toggleKey(key)}
                        >
                            <div className={`${innerClass} px-3 py-2`}>
                                <div className="text-xs text-gray-900 font-semibold">{label}</div>
                                <div className="font-bold text-lg">{display}</div>
                                <div className="text-xs text-gray-700 mt-0.5">{isSelected ? 'Click to hide chart' : 'Click to view chart'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {selected && (
                <div className="px-4 pb-4">
                    <MetricChart
                        data={getChartData(selected.key)}
                        title={selected.label}
                        unit={selected.unit}
                        color={selected.color}
                        fill={selected.fill}
                        valueFormatter={selected.isDirection ? degreesToCompass : undefined}
                    />
                </div>
            )}
            <CollapsibleTable label="Hourly Data">
                <table className="w-full text-sm border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-blue-900 text-white text-xs">
                            <th className="text-left px-3 py-1 font-bold">🕐 Time</th>
                            <th className="text-right px-3 py-1 font-bold">🌡️ Air Temp</th>
                            <th className="text-right px-3 py-1 font-bold">🔵 Pressure</th>
                            <th className="text-right px-3 py-1 font-bold">💨 Wind</th>
                            <th className="text-right px-3 py-1 font-bold">💨 Wind Dir</th>
                            <th className="text-right px-3 py-1 font-bold">☁️ Cloud</th>
                            <th className="text-right px-3 py-1 font-bold">💧 Humidity</th>
                            <th className="text-right px-3 py-1 font-bold">🌧️ Precip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weatherData.properties.timeseries.slice(0, 48).map((e, i) => {
                            const inst = e.data.instant.details;
                            const precip = e.data.next_1_hours?.details.precipitation_amount;
                            const dt = new Date(e.time);
                            return (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-300' : 'bg-gray-400'}>
                                    <td className="px-3 py-1 text-xs font-bold">
                                        {dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        {' '}{dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.air_temperature !== undefined ? `${inst.air_temperature.toFixed(1)} °C` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.air_pressure_at_sea_level !== undefined ? `${inst.air_pressure_at_sea_level.toFixed(0)} hPa` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.wind_speed !== undefined ? `${inst.wind_speed.toFixed(1)} m/s` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.wind_from_direction !== undefined ? <DirectionArrow degrees={inst.wind_from_direction} from /> : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.cloud_area_fraction !== undefined ? `${inst.cloud_area_fraction.toFixed(0)}%` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {inst.relative_humidity !== undefined ? `${inst.relative_humidity.toFixed(0)}%` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {precip !== undefined ? `${precip.toFixed(1)} mm` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CollapsibleTable>
        </SectionPanel>
    );
}
