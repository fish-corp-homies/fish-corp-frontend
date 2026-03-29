import { useState } from 'react';
import RetroButton from "@/components/RetroButton";

interface Coordinates {
    lat: number | null;
    lon: number | null;
}

export default function Window() {
    const [coords, setCoords] = useState<Coordinates>({ lat: null, lon: null });
    const [error, setError] = useState<string | null>(null);

    const getPosition = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        // Options to tweak accuracy and timeout
        const options = {
            enableHighAccuracy: false, // Set to false for a faster, "approximate" read
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                setError(null);
            },
            (err) => {
                setError(`Error: ${err.message}`);
            },
            options
        );
    };

    return(
        <div className="outer-border m-8">
            <div className="inner-border">
                <div className="bg-blue-800 flex justify-between w-full">
                    <div className="m-1 text-white font-bold">
                        Fish Corp
                    </div>
                    <div className="outer-border m-1 bg-gray-400 px-1">
                         X
                    </div>

                </div>
                <img src="https://instagram.fosl3-2.fna.fbcdn.net/v/t51.75761-15/501070469_18465905875075963_73448687709549686_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzY0MTk1Nzk2ODg0MTUwMTczNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcwMXg0NjEuc2RyLkMzIn0%3D&_nc_ohc=fWBYRjjCOuMQ7kNvwGgM376&_nc_oc=AdpHiAmKnbXsqxuu2sP9HS0HezrxswE6kZPevEX_yk5zHKOU8NqO9ypUcu1fhDagdQfQWm4An0bAfvDcXbIPPJu2&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fosl3-2.fna&_nc_gid=6uF8VQXjJ2Ks1jin-Na3yw&_nc_ss=7a32e&oh=00_Afw49YRB7JYPzcQ6HS32FBNSyd-Lz_oKwLTmbH0u-nTDQQ&oe=69CEC02F"/>
                <RetroButton onClick={getPosition}>test</RetroButton>
                {coords.lat !== null && coords.lon !== null && (
                    <div className="mt-4 p-4 border rounded bg-slate-100">
                        {/* toFixed() works safely here because TS knows they are numbers now */}
                        <p><strong>Latitude:</strong> {coords.lat.toFixed(4)}</p>
                        <p><strong>Longitude:</strong> {coords.lon.toFixed(4)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}