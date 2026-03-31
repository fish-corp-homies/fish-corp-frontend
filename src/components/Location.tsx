interface LocationProps {
    lat: number | undefined;
    lon: number | undefined;
}

export default function Location({ lat, lon }: LocationProps) {
    return (
        <>
            <p>Lat: {lat}</p>
            <p>Lon: {lon}</p>
        </>
    );
}
