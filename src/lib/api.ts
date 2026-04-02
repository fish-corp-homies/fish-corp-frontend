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