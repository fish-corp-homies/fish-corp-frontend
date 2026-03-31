# fish-corp-frontend

Frontend for Fish Corp — built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## What is Fish Corp?

Fish Corp gathers all the environmental data you need to judge whether conditions are good for fishing. Rather than consulting scattered sources, you get a single view combining real-time and forecast data for your location.

The platform focuses on **sea trout** as the primary target species, with **Atlantic salmon** also supported. It is designed so that additional species and data sources can be added with minimal effort.

### Data we collect

| Factor | Why it matters |
|--------|----------------|
| **Water temperature** | Fish are cold-blooded — temperature governs activity and feeding drive |
| **Tidal information** | Tidal currents concentrate baitfish and trigger predatory feeding windows |
| **Atmospheric pressure** | A falling barometer often triggers a feeding frenzy; rising pressure pushes fish deep |
| **Moon phase** | Controls tidal amplitude and solunar feeding peaks |
| **Wind** | Ripple reduces fish wariness; onshore wind concentrates prey along shore |
| **Precipitation & run-off** | Rainfall triggers sea trout and salmon migration runs into rivers |
| **Cloud cover & light** | Overcast days bring fish into shallower water; bright sun pushes them deep |
| **Salinity** | Gradients in estuaries help locate staging fish during tidal movement |

See the [About page](/about) for a detailed breakdown of how to interpret each factor.

## Stack

- **Next.js 16** — app router, static export
- **React 19** — UI components
- **Tailwind CSS v4** — styling
- **TypeScript** — type safety

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` — home
- `/map` — map view
- `/about` — data guide and species information
- `/styling` — styling showcase

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
