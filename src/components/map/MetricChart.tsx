import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface DataPoint {
    time: string;
    value: number | undefined;
}

interface MetricChartProps {
    data: DataPoint[];
    title: string;
    unit: string;
    color?: string;
    fill?: string;
    valueFormatter?: (v: number) => string;
}

function formatTick(time: string): string {
    const d = new Date(time);
    return d.toLocaleDateString('en-GB', { weekday: 'short' })
        + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
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

export default function MetricChart({ data, title, unit, color = '#1E40AF', fill = '#BFDBFE', valueFormatter }: MetricChartProps) {
    const filtered = data.filter((e): e is { time: string; value: number } => e.value !== undefined);
    if (filtered.length === 0) return null;

    const interval = Math.max(0, Math.floor(filtered.length / 5));

    return (
        <div className="outer-border mt-3">
            <div className="inner-border p-0 overflow-hidden">
                <div className="bg-blue-800 text-white font-bold px-2 py-1 text-xs select-none">
                    {title} — next 48 hours
                </div>
                <div className="p-2">
                    <ResponsiveContainer width="100%" height={210}>
                        <AreaChart data={filtered} margin={{ top: 16, right: 8, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                            <XAxis
                                dataKey="time"
                                tick={<AxisTick />}
                                interval={interval}
                                height={44}
                            />
                            <YAxis tick={{ fontSize: 9, fill: '#374151' }} unit={unit} width={52} />
                            <Tooltip
                                contentStyle={{ background: '#9CA3AF', border: '2px solid #4B5563', fontSize: 12 }}
                                labelFormatter={(time) => {
                                    const d = new Date(time as string);
                                    return d.toLocaleString('en-GB', {
                                        weekday: 'short', day: 'numeric', month: 'short',
                                        hour: '2-digit', minute: '2-digit',
                                    });
                                }}
                                formatter={(v) => [typeof v === 'number' ? (valueFormatter ? valueFormatter(v) : `${v.toFixed(1)}${unit}`) : v, title]}
                            />
                            <Area type="monotone" dataKey="value" stroke={color} fill={fill} strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
