"use client";

import Link from "next/link";
import RetroButton from "@/components/RetroButton";
import {useEffect, useState} from "react";

export default function Navbar() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="outer-border">
            <nav className="flex justify-between w-full inner-border p-2">

                <Link href="/">
                    <RetroButton>
                        <div>Home🐟</div>
                    </RetroButton>
                </Link>

                <Link href="/map">
                    <RetroButton>
                        <div>Map</div>
                    </RetroButton>
                </Link>

                <Link href="/about">
                    <RetroButton>
                        <div>About</div>
                    </RetroButton>
                </Link>

                <div className="pressed-outer-border flex items-center">
                    <div className="pressed-inner-border">
                        <span className="text-sm sm:text-[22px]">{timeString}</span>
                    </div>
                </div>

            </nav>
        </div>
    );
};