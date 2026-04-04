'use client';

import { useState } from 'react';
import SectionPanel from '@/components/SectionPanel';
import MetricChart from '@/components/map/MetricChart';
import CollapsibleTable from '@/components/map/CollapsibleTable';
import { OceanDetails, OceanData } from '@/lib/api';
import { degreesToCompass } from '@/lib/direction';
import DirectionArrow from '@/components/DirectionArrow';

interface ConditionConfig {
    key: keyof OceanDetails;
    label: string;
    unit: string;
    color: string;
    fill: string;
    isDirection?: boolean;
    fromDirection?: boolean;
}

const CONDITION_LABELS: ConditionConfig[] = [
    { key: 'sea_water_temperature',           label: '🌡️ Water Temperature', unit: ' °C',  color: '#1E40AF', fill: '#BFDBFE' },
    { key: 'sea_surface_wave_height',         label: '🌊 Wave Height',        unit: ' m',   color: '#0891B2', fill: '#CFFAFE' },
    { key: 'sea_surface_wave_from_direction', label: '🌊 Wave Direction',     unit: '°',    color: '#7C3AED', fill: '#EDE9FE', isDirection: true, fromDirection: true },
    { key: 'sea_water_speed',                 label: '🔄 Current Speed',      unit: ' m/s', color: '#059669', fill: '#D1FAE5' },
    { key: 'sea_water_to_direction',          label: '🔄 Current Direction',  unit: '°',    color: '#D97706', fill: '#FEF3C7', isDirection: true },
];

interface OceanConditionsProps {
    currentDetails: OceanDetails | null | undefined;
    currentTime: string | null | undefined;
    selectedPosition: [number, number] | null;
    oceanData: OceanData | null;
    startTime: Date;
    endTime: Date;
}

export default function OceanConditions({ currentDetails, currentTime, selectedPosition, oceanData, startTime, endTime }: OceanConditionsProps) {
    const [selectedKey, setSelectedKey] = useState<keyof OceanDetails | null>(null);

    if (!currentDetails) return null;

    const title = `🌊 Ocean Conditions${currentTime ? ` — ${new Date(currentTime).toLocaleString()}` : ''}`;

    function toggleKey(key: keyof OceanDetails) {
        setSelectedKey(prev => (prev === key ? null : key));
    }

    const selected = selectedKey ? CONDITION_LABELS.find(c => c.key === selectedKey) : null;

    const timeseries = (oceanData?.properties?.timeseries ?? [])
        .filter(e => { const t = new Date(e.time); return t >= startTime && t < endTime; });

    const chartData = selected
        ? timeseries.map(e => ({ time: e.time, value: e.data.instant.details[selected.key] }))
        : [];

    return (
        <SectionPanel title={title} className="mb-4">
            <div className="p-4 pb-0 text-xs text-gray-900 font-semibold grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPosition && (
                    <div>
                        <span className="font-bold">Requested:</span>{' '}
                        {selectedPosition[0].toFixed(4)}°N, {selectedPosition[1].toFixed(4)}°E
                    </div>
                )}
                {oceanData?.geometry && (
                    <div>
                        <span className="font-bold">API location:</span>{' '}
                        {oceanData.geometry.coordinates[1].toFixed(4)}°N, {oceanData.geometry.coordinates[0].toFixed(4)}°E
                    </div>
                )}
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONDITION_LABELS.map(({ key, label, unit, isDirection, fromDirection }) => {
                    const value = currentDetails[key];
                    if (value === undefined) return null;
                    const isSelected = selectedKey === key;
                    const outerClass = isSelected ? 'pressed-outer-border' : 'outer-border';
                    const innerClass = isSelected ? 'pressed-inner-border' : 'inner-border';
                    const display = isDirection && typeof value === 'number'
                        ? <DirectionArrow degrees={value} from={fromDirection} />
                        : `${typeof value === 'number' ? value.toFixed(1) : value}${unit}`;
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
                        data={chartData}
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
                            <th className="text-right px-3 py-1 font-bold">🌡️ Water Temp</th>
                            <th className="text-right px-3 py-1 font-bold">🌊 Wave Height</th>
                            <th className="text-right px-3 py-1 font-bold">🌊 Wave Dir</th>
                            <th className="text-right px-3 py-1 font-bold">🔄 Current Speed</th>
                            <th className="text-right px-3 py-1 font-bold">🔄 Current Dir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeseries.map((e, i) => {
                            const d = e.data.instant.details;
                            const dt = new Date(e.time);
                            return (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-300' : 'bg-gray-400'}>
                                    <td className="px-3 py-1 text-xs font-bold">
                                        {dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        {' '}{dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {d.sea_water_temperature !== undefined ? `${d.sea_water_temperature.toFixed(1)} °C` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {d.sea_surface_wave_height !== undefined ? `${d.sea_surface_wave_height.toFixed(1)} m` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {d.sea_surface_wave_from_direction !== undefined ? <DirectionArrow degrees={d.sea_surface_wave_from_direction} from /> : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {d.sea_water_speed !== undefined ? `${d.sea_water_speed.toFixed(2)} m/s` : '—'}
                                    </td>
                                    <td className="px-3 py-1 text-right font-mono">
                                        {d.sea_water_to_direction !== undefined ? <DirectionArrow degrees={d.sea_water_to_direction} /> : '—'}
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
