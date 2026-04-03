import SectionPanel from '@/components/SectionPanel';
import { TideForecastEntry, SunData, OceanDetails } from '@/lib/api';

interface TideCardProps {
    label: string;
    entry: TideForecastEntry;
}

function TideCard({ label, entry }: TideCardProps) {
    const isHigh = entry.status.toLowerCase() === 'high';
    const dt = new Date(entry.dateTime);
    return (
        <div className="outer-border h-full">
            <div className="inner-border h-full px-3 py-3">
                <div className="text-xs text-gray-900 font-semibold">{label}</div>
                <div className={`font-bold text-xl leading-tight ${isHigh ? 'text-blue-900' : 'text-gray-700'}`}>
                    {isHigh ? '▲' : '▼'} {isHigh ? 'High' : 'Low'}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                    {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}{dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
                <div className="font-mono text-sm">{entry.measurement.value.toFixed(1)} {entry.measurement.unit}</div>
            </div>
        </div>
    );
}

interface AtAGlanceProps {
    currentDetails: OceanDetails | null | undefined;
    lastTide: TideForecastEntry | null;
    nextTides: TideForecastEntry[];
    sunData: SunData | null;
}

export default function AtAGlance({ currentDetails, lastTide, nextTides, sunData }: AtAGlanceProps) {
    const hasContent =
        currentDetails?.sea_water_temperature !== undefined ||
        lastTide !== null ||
        nextTides.length > 0 ||
        sunData !== null;

    if (!hasContent) return null;

    return (
        <SectionPanel title="👁️ At a glance" className="mb-4">
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentDetails?.sea_water_temperature !== undefined && (
                    <div className="outer-border h-full">
                        <div className="inner-border h-full px-3 py-3">
                            <div className="text-xs text-gray-900 font-semibold">🌡️ Water Temperature</div>
                            <div className="font-bold text-2xl leading-tight">
                                {currentDetails.sea_water_temperature.toFixed(1)}°C
                            </div>
                        </div>
                    </div>
                )}
                {lastTide && <TideCard label="Last tide" entry={lastTide} />}
                {nextTides.map((tide, i) => (
                    <TideCard key={i} label={i === 0 ? 'Next tide' : 'Then'} entry={tide} />
                ))}
                {sunData && (
                    <div className="outer-border h-full">
                        <div className="inner-border h-full px-3 py-3">
                            <div className="text-xs text-gray-900 font-semibold">🌅 Sunrise</div>
                            <div className="font-bold text-xl leading-tight text-yellow-700">
                                {new Date(sunData.properties.sunrise.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">{sunData.properties.sunrise.azimuth.toFixed(0)}° azimuth</div>
                        </div>
                    </div>
                )}
                {sunData && (
                    <div className="outer-border h-full">
                        <div className="inner-border h-full px-3 py-3">
                            <div className="text-xs text-gray-900 font-semibold">🌇 Sunset</div>
                            <div className="font-bold text-xl leading-tight text-orange-700">
                                {new Date(sunData.properties.sunset.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">{sunData.properties.sunset.azimuth.toFixed(0)}° azimuth</div>
                        </div>
                    </div>
                )}
            </div>
        </SectionPanel>
    );
}
