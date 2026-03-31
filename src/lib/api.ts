export async function getOceanData(lat: number | null, lon: number | null) {
    const res = await fetch(
        `https://api.met.no/weatherapi/oceanforecast/2.0/complete?lat=${lat}&lon=${lon}`,
        {
            headers: {
                'User-Agent': 'my-app',
            },
        }
    );

    return res.json();
}