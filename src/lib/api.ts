export interface OceanDetails {
    sea_water_temperature?: number;
    sea_surface_wave_height?: number;
    sea_surface_wave_from_direction?: number;
    sea_water_speed?: number;
    sea_water_to_direction?: number;
}

export interface OceanData {
    geometry?: { coordinates: [number, number] };
    properties?: {
        timeseries?: Array<{
            time: string;
            data: { instant: { details: OceanDetails } };
        }>;
    };
    detail?: string;
}

export async function getOceanData(lat: number | null, lon: number | null) {
    const res = await fetch(
        `https://api.met.no/weatherapi/oceanforecast/2.0/complete?lat=${lat}&lon=${lon}`,
    );

    return res.json();
}

export interface TideMeasurement {
    value: number;
    unit: string;
}

export interface TideForecastEntry {
    status: string;
    dateTime: string;
    measurement: TideMeasurement;
}

export interface KartverketTideResponse {
    result: {
        forecasts: TideForecastEntry[];
    };
}

export async function getTidalData(lat: number, lon: number): Promise<TideForecastEntry[]> {
    const res = await fetch(
        `https://kartverket.no/api/vsl/tideforecast?latitude=${lat}&longitude=${lon}&language=nb`,
    );
    if (!res.ok) throw new Error(`Kartverket API error: ${res.status}`);
    const data: KartverketTideResponse = await res.json();
    return data.result.forecasts;
}

export interface SunData {
    properties: {
        sunrise: { time: string; azimuth: number };
        sunset: { time: string; azimuth: number };
        solarnoon: { time: string; disc_centre_elevation: number; visible: boolean };
    };
}

export async function getSunrise(lat: number, lon: number): Promise<SunData> {
    const date = new Date().toISOString().slice(0, 10);
    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const h = Math.floor(Math.abs(offsetMinutes) / 60).toString().padStart(2, '0');
    const m = (Math.abs(offsetMinutes) % 60).toString().padStart(2, '0');
    const offset = encodeURIComponent(`${sign}${h}:${m}`);
    const res = await fetch(
        `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=${lat}&lon=${lon}&date=${date}&offset=${offset}`,
    );
    if (!res.ok) throw new Error(`Sunrise API error: ${res.status}`);
    return res.json();
}

export interface WeatherEntry {
    time: string;
    data: {
        instant: {
            details: {
                air_pressure_at_sea_level?: number;
                air_temperature?: number;
                cloud_area_fraction?: number;
                relative_humidity?: number;
                wind_from_direction?: number;
                wind_speed?: number;
            };
        };
        next_1_hours?: {
            summary: { symbol_code: string };
            details: { precipitation_amount?: number };
        };
    };
}

export interface WeatherForecastData {
    properties: {
        timeseries: WeatherEntry[];
    };
}

export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecastData> {
    const res = await fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
    );
    if (!res.ok) throw new Error(`Weather forecast API error: ${res.status}`);
    return res.json();
}