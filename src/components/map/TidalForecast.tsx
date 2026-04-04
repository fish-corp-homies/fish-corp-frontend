'use client';

import { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionPanel from '@/components/SectionPanel';
import { TideForecastEntry } from '@/lib/api';

function formatTick(time: string): string {
    const d = new Date(time);
    const h = d.getHours();
    const m = d.getMinutes();
    // Label as midnight/noon if within 3 hours of those marks
    if (h < 3 || h >= 21) return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    if (h >= 9 && h <= 15) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AxisTick({ x, y, payload }: any) {
    return (
        <g transform={`translate(${x},${y})`}>
            <text transform="rotate(-30)" textAnchor="end" fontSize={9} fill="#374151">
                {formatTick(payload.value)}
            </text>
        </g>
    );
}


/** Find the data entry closest to each midnight and noon within the data range. */
function getMidnightNoonTicks(chartData: { time: string }[]): string[] {
    if (chartData.length === 0) return [];

    const start = new Date(chartData[0].time);
    const end = new Date(chartData[chartData.length - 1].time);

    const targets: Date[] = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= end) {
        targets.push(new Date(cursor));
        cursor.setHours(12);
        targets.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
        cursor.setHours(0, 0, 0, 0);
    }

    const lastTime = chartData[chartData.length - 1].time;
    const seen = new Set<string>();
    return targets.map(target => {
        const closest = chartData.reduce((best, curr) =>
            Math.abs(new Date(curr.time).getTime() - target.getTime()) <
            Math.abs(new Date(best.time).getTime() - target.getTime()) ? curr : best
        );
        return closest.time;
    })
    .filter(t => t !== lastTime) // exclude edge entry
    .filter(t => { if (seen.has(t)) return false; seen.add(t); return true; });
}

interface TidalForecastProps {
    tidalData: TideForecastEntry[] | null;
    startTime: Date;
    endTime: Date;
}

export default function TidalForecast({ tidalData, startTime, endTime }: TidalForecastProps) {
    const [showChart, setShowChart] = useState(false);

    if (!tidalData || tidalData.length === 0) return null;

    const filtered = tidalData.filter(e => { const t = new Date(e.dateTime); return t >= startTime && t < endTime; });
    const chartData = filtered.map(e => ({ time: e.dateTime, height: e.measurement.value }));
    const ticks = getMidnightNoonTicks(chartData);

    return (
        <SectionPanel title="🌊 Tidal Forecast">
            <div className="px-4 pt-3 pb-2">
                <div
                    className={`${showChart ? 'pressed-outer-border' : 'outer-border'} cursor-pointer select-none w-fit`}
                    onClick={() => setShowChart(prev => !prev)}
                >
                    <div className={`${showChart ? 'pressed-inner-border' : 'inner-border'} px-3 py-1 text-xs font-bold`}>
                        {showChart ? 'Hide Chart' : 'Show Chart'}
                    </div>
                </div>
            </div>
            {showChart && (
                <div className="px-4 pb-4">
                    <div className="outer-border">
                        <div className="inner-border p-2">
                            <ResponsiveContainer width="100%" height={210}>
                                <AreaChart data={chartData} margin={{ top: 16, right: 8, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                                    <XAxis
                                        dataKey="time"
                                        tick={<AxisTick />}
                                        ticks={ticks}
                                        minTickGap={0}
                                        height={44}
                                    />
                                    <YAxis tick={{ fontSize: 9, fill: '#374151' }} unit=" cm" width={52} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ background: '#9CA3AF', border: '2px solid #4B5563', fontSize: 12 }}
                                        labelFormatter={(time) => {
                                            const d = new Date(time as string);
                                            return d.toLocaleString('en-GB', {
                                                weekday: 'short', day: 'numeric', month: 'short',
                                                hour: '2-digit', minute: '2-digit',
                                            });
                                        }}
                                        formatter={(v) => [typeof v === 'number' ? `${v.toFixed(1)} cm` : v, 'Height']}
                                    />
                                    {ticks.map(time => (
                                        <ReferenceLine key={time} x={time} stroke="rgba(30, 64, 175, 0.4)" strokeDasharray="4 4" />
                                    ))}
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
            )}
            <div className="px-4 pb-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-900 text-white text-xs">
                            <th className="text-left px-3 py-1 font-bold">🌊 Status</th>
                            <th className="text-left px-3 py-1 font-bold">📅 Date</th>
                            <th className="text-left px-3 py-1 font-bold">🕐 Time</th>
                            <th className="text-right px-3 py-1 font-bold">📏 Height</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((entry, i) => {
                            const dt = new Date(entry.dateTime);
                            const isHigh = entry.status.toLowerCase() === 'high';
                            return (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-300' : 'bg-gray-400'}>
                                    <td className="px-3 py-1">
                                        <span className={`font-bold ${isHigh ? 'text-blue-900' : 'text-gray-700'}`}>
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
        </SectionPanel>
    );
}
