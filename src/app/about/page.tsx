type Factor = {
    icon: string;
    label: string;
    description: string;
};

type FishCondition = {
    factor: string;
    note: string;
};

type FishProfile = {
    name: string;
    icon: string;
    optimalTemp: string;
    notes: string;
    conditions: FishCondition[];
};

const WEATHER_FACTORS: Factor[] = [
    {
        icon: "🌡️",
        label: "Water Temperature",
        description: "Water temperature governs fish metabolism and feeding drive. Cold-blooded fish are directly influenced by the water around them.",
    },
    {
        icon: "🌊",
        label: "Tidal Information",
        description: "Tides drive currents that concentrate baitfish and trigger predatory feeding. Understanding the tidal cycle helps you find the right window.",
    },
    {
        icon: "📊",
        label: "Atmospheric Pressure",
        description: "Barometric pressure affects fish swim bladders and therefore their depth preference and feeding drive.",
    },
    {
        icon: "🌙",
        label: "Moon Phase",
        description: "The moon controls tidal amplitude and influences fish feeding rhythms through solunar cycles — peak feeding times tied to the moon's position.",
    },
    {
        icon: "💨",
        label: "Wind",
        description: "Wind stirs the surface, reduces fish wariness, and pushes baitfish — and the predators that follow — to specific areas.",
    },
    {
        icon: "🌧️",
        label: "Precipitation & Run-off",
        description: "Rain changes river levels and salinity gradients, directly triggering or pausing migration runs.",
    },
    {
        icon: "☁️",
        label: "Cloud Cover & Light",
        description: "Light penetration affects visibility in the water column and fish confidence. Low light brings fish into shallower water.",
    },
    {
        icon: "🧂",
        label: "Salinity",
        description: "Salinity gradients in estuaries attract migratory fish as they transition between salt and fresh water.",
    },
];

const FISH_PROFILES: FishProfile[] = [
    {
        name: "Sea Trout",
        icon: "🐟",
        optimalTemp: "8–16 °C",
        notes: "Sea trout (Salmo trutta) are the primary focus. Anadromous — born in rivers, they spend years at sea before returning to spawn. Feeding windows are short and tied tightly to tidal movement, low light, and solunar peaks. Night fishing in estuaries and river mouths is classic. Key season: late spring through autumn.",
        conditions: [
            { factor: "🌡️ Water Temp", note: "Most active 8–16 °C. Below 5 °C feeding drops sharply." },
            { factor: "🌊 Tide", note: "First 2 hrs of flood tide in estuaries. Spring tides produce most movement." },
            { factor: "📊 Pressure", note: "Falling barometer triggers surface feeding. Avoid rapid rises." },
            { factor: "🌙 Moon", note: "Night fishing peaks around full moon. Solunar majors at dusk/dawn." },
            { factor: "💨 Wind", note: "Light onshore breeze ideal. Flat calm makes fish spooky." },
            { factor: "🌧️ Rain", note: "Spate after drought unlocks river runs. Fish 24–48 hrs after heavy rain." },
            { factor: "☁️ Light", note: "Overcast brings fish shallow. Bright sun pushes them deep." },
            { factor: "🧂 Salinity", note: "Stage in brackish estuaries. Low salinity after rain draws fish to river mouths." },
        ],
    },
    {
        name: "Atlantic Salmon",
        icon: "🐠",
        optimalTemp: "4–14 °C",
        notes: "Atlantic salmon (Salmo salar) migrate from ocean feeding grounds to spawn in their home rivers. They stop feeding once in fresh water, so the goal is to trigger aggression rather than hunger. Best conditions are a rising, clearing river after rain. Prefer cooler water than sea trout.",
        conditions: [
            { factor: "🌡️ Water Temp", note: "Most active 4–14 °C. Above 18 °C fish become lethargic and stressed." },
            { factor: "🌊 Tide", note: "Tidal push in lower rivers moves fish. Flood tide aids upstream migration." },
            { factor: "📊 Pressure", note: "Stable or slowly falling pressure. Sharp rises stall migration." },
            { factor: "🌙 Moon", note: "New and full moons coincide with stronger upstream movement." },
            { factor: "💨 Wind", note: "Less critical than for sea trout. Upstream wind can aid river entry." },
            { factor: "🌧️ Rain", note: "A spate is often essential — fish run best in rising to clearing water." },
            { factor: "☁️ Light", note: "Overcast days produce more aggressive takes in clear pools." },
            { factor: "🧂 Salinity", note: "Congregate at river mouths waiting for fresh water to drop into the river." },
        ],
    },
];

export default function About() {
    return (
        <div className="m-4 mb-20">

            {/* Main window */}
            <div className="outer-border mb-6">
                <div className="inner-border">
                    <div className="bg-blue-800 flex items-center w-full px-2 py-1">
                        <span className="text-white font-bold text-sm">Fish Corp — About</span>
                    </div>
                    <div className="p-4 bg-gray-300">
                        <h1 className="text-xl font-bold mb-2">What is Fish Corp?</h1>
                        <p className="text-sm leading-relaxed">
                            Fish Corp collects and presents the environmental data you need to decide whether conditions are right for fishing.
                            Rather than relying on gut feeling, we combine real-time and forecast data into a single view so you can
                            identify productive windows before you leave home.
                        </p>
                        <p className="text-sm leading-relaxed mt-2">
                            The primary focus is <strong>sea trout</strong> in coastal and estuarine environments, with support for
                            <strong> Atlantic salmon</strong> as well. The platform is built to grow — additional species and data
                            sources can be added over time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fish profiles */}
            <div className="outer-border mb-6">
                <div className="inner-border">
                    <div className="bg-blue-800 flex items-center w-full px-2 py-1">
                        <span className="text-white font-bold text-sm">Target Species</span>
                    </div>
                    <div className="p-4 bg-gray-300">
                        <div className="flex flex-col gap-4">
                            {FISH_PROFILES.map((fish) => (
                                <div key={fish.name} className="outer-border">
                                    <div className="inner-border p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{fish.icon}</span>
                                            <span className="font-bold text-sm">{fish.name}</span>
                                            <span className="ml-auto outer-border pressed-outer-border">
                                                <span className="pressed-inner-border text-xs px-2 py-0.5 block">
                                                    {fish.optimalTemp}
                                                </span>
                                            </span>
                                        </div>
                                        <p className="text-xs leading-relaxed mb-3">{fish.notes}</p>
                                        <div className="flex flex-col gap-1">
                                            {fish.conditions.map((c) => (
                                                <div key={c.factor} className="flex gap-2 text-xs">
                                                    <span className="font-bold whitespace-nowrap w-24 sm:w-32 shrink-0">{c.factor}</span>
                                                    <span className="leading-relaxed">{c.note}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data factors */}
            <div className="outer-border">
                <div className="inner-border">
                    <div className="bg-blue-800 flex items-center w-full px-2 py-1">
                        <span className="text-white font-bold text-sm">How to Read the Data</span>
                    </div>
                    <div className="p-4 bg-gray-300">
                        <p className="text-sm mb-4">
                            Each factor below influences fish behaviour in a different way.
                            No single metric decides the outcome — it is the combination that matters.
                            A falling barometer + flood tide + overcast sky + correct water temperature is a session worth making.
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            {WEATHER_FACTORS.map((factor) => (
                                <div key={factor.label} className="outer-border">
                                    <div className="inner-border p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base">{factor.icon}</span>
                                            <span className="font-bold text-sm">{factor.label}</span>
                                        </div>
                                        <p className="text-xs leading-relaxed">{factor.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
