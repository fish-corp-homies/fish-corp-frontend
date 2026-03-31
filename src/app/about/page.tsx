type Factor = {
    icon: string;
    label: string;
    description: string;
    details: string[];
};

type FishProfile = {
    name: string;
    icon: string;
    optimalTemp: string;
    notes: string;
};

const WEATHER_FACTORS: Factor[] = [
    {
        icon: "🌡️",
        label: "Water Temperature",
        description: "Water temperature is one of the most critical factors affecting fish activity and feeding behavior. Cold-blooded fish are directly influenced by the water around them.",
        details: [
            "Sea trout are most active between 8–16 °C",
            "Below 5 °C fish slow down and feed less",
            "Above 18 °C oxygen levels drop and fish become stressed",
            "Temperature changes during tidal movement create feeding opportunities",
        ],
    },
    {
        icon: "🌊",
        label: "Tidal Information",
        description: "Tides drive currents that concentrate baitfish and trigger predatory feeding. Understanding the tidal cycle helps you find the right window.",
        details: [
            "Incoming tide brings food and oxygenated water into estuaries",
            "First two hours of flood and ebb are typically the most productive",
            "Spring tides (new/full moon) produce stronger currents and more active fish",
            "Neap tides give calmer, clearer water — adjust lure presentation accordingly",
        ],
    },
    {
        icon: "📊",
        label: "Atmospheric Pressure",
        description: "Barometric pressure affects fish swim bladders and therefore their depth preference and feeding drive. A falling barometer often triggers a feeding frenzy.",
        details: [
            "Falling pressure: fish become more active and move toward surface",
            "Rising pressure: fish tend to settle deeper and feed less aggressively",
            "Stable pressure: predictable behavior, fish follow normal feeding patterns",
            "Rapid drops (storm fronts) can produce excellent short windows before conditions deteriorate",
        ],
    },
    {
        icon: "🌙",
        label: "Moon Phase",
        description: "The moon controls tidal amplitude and also influences fish feeding rhythms through solunar cycles — peak feeding times tied to the moon's position.",
        details: [
            "Full and new moons produce the strongest tides (spring tides)",
            "Solunar major periods occur when the moon is directly overhead or underfoot",
            "Sea trout are often most active around dusk, dawn, and solunar peaks",
            "Night fishing under a full moon can be particularly productive for sea trout",
        ],
    },
    {
        icon: "💨",
        label: "Wind",
        description: "Wind stirs the water surface, reduces fish wariness, and pushes baitfish — and the predators that follow — to specific areas.",
        details: [
            "Onshore wind concentrates prey along shorelines and in bays",
            "Light breeze creates ripple that masks the angler's presence",
            "Strong winds above 8 m/s make presentation difficult and fish less catchable",
            "Wind direction relative to current determines productive casting angles",
        ],
    },
    {
        icon: "🌧️",
        label: "Precipitation & Freshwater Run-off",
        description: "Rain affects both river and coastal fishing. Fresh water pouring into the sea changes salinity gradients, attracting migratory fish.",
        details: [
            "Significant rainfall triggers sea trout and salmon runs into rivers",
            "Spate rivers fish best 24–48 hours after heavy rain as water clears",
            "Run-off carries insects and invertebrates — sea trout follow baitfish moving to feed",
            "Prolonged drought keeps fish locked in the sea; a good spate unlocks a river",
        ],
    },
    {
        icon: "☁️",
        label: "Cloud Cover & Light",
        description: "Light penetration directly affects visibility in the water column and fish confidence. Overcast skies are generally better for sea trout.",
        details: [
            "Overcast conditions reduce light — sea trout venture into shallow water",
            "Bright, sunny days push fish into deeper, darker water",
            "Dawn and dusk are prime regardless of cloud cover",
            "In clear water, bright conditions require smaller, more natural presentations",
        ],
    },
    {
        icon: "🧂",
        label: "Salinity",
        description: "Salinity gradients in estuaries attract sea trout as they transition between sea and fresh water. Knowing the mixing zone helps locate fish.",
        details: [
            "Sea trout stage in brackish estuaries before running upstream",
            "Tidal influx of salt water pushes fish holding positions upstream and downstream",
            "Low salinity after heavy rain draws fish closer to river mouths",
            "Rapid salinity change can pause migration — fish hold until conditions stabilize",
        ],
    },
];

const FISH_PROFILES: FishProfile[] = [
    {
        name: "Sea Trout",
        icon: "🐟",
        optimalTemp: "8–16 °C",
        notes:
            "Sea trout (Salmo trutta) are the primary focus. They are anadromous — born in rivers, they spend years at sea before returning to spawn. Feeding windows are often short and tied tightly to tidal movement, low light, and solunar peaks. Night fishing in estuaries and river mouths is classic. Key season is late spring through autumn.",
    },
    {
        name: "Atlantic Salmon",
        icon: "🐠",
        optimalTemp: "4–14 °C",
        notes:
            "Atlantic salmon (Salmo salar) migrate from ocean feeding grounds to spawn in the rivers they were born in. They stop feeding actively once in fresh water, so timing spate conditions and using lures or flies that trigger aggression is key. Prefer cooler water than sea trout; best conditions are a rising, clearing river after rain.",
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
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{fish.icon}</span>
                                            <span className="font-bold text-sm">{fish.name}</span>
                                            <span className="ml-auto outer-border pressed-outer-border">
                                                <span className="pressed-inner-border text-xs px-2 py-0.5 block">
                                                    {fish.optimalTemp}
                                                </span>
                                            </span>
                                        </div>
                                        <p className="text-xs leading-relaxed">{fish.notes}</p>
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
                                        <p className="text-xs leading-relaxed mb-2">{factor.description}</p>
                                        <ul className="list-none">
                                            {factor.details.map((d, i) => (
                                                <li key={i} className="text-xs before:content-['▸'] before:mr-1 leading-relaxed">
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
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
