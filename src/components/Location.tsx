export default function Location(
    lat: string | undefined,
    lon: string | undefined
) {

    return(
        <>
            <p>Lat: {lat}</p>
            <p>Lon: {lon}</p>
        </>
    )
}