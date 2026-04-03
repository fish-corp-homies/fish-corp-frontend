import RetroButton from '@/components/RetroButton';

interface MapControlsProps {
    selectedPosition: [number, number] | null;
    loading: boolean;
    locating: boolean;
    onMyLocation: () => void;
    onFetch: () => void;
}

export default function MapControls({ selectedPosition, loading, locating, onMyLocation, onFetch }: MapControlsProps) {
    return (
        <div className="outer-border mb-4">
            <div className="inner-border px-4 py-3 flex flex-wrap items-center gap-4">
                {selectedPosition ? (
                    <span className="text-sm">
                        <strong>📌 Selected:</strong> {selectedPosition[0].toFixed(4)}°N, {selectedPosition[1].toFixed(4)}°E
                    </span>
                ) : (
                    <span className="text-sm text-gray-800">No location selected — click on the map</span>
                )}
                <RetroButton onClick={onMyLocation} padding="px-4 py-1">
                    {locating ? 'Locating...' : '📍 My Location'}
                </RetroButton>
                <RetroButton onClick={onFetch} padding="px-6 py-1">
                    {loading ? 'Fetching...' : '🔍 Get Conditions'}
                </RetroButton>
            </div>
        </div>
    );
}
