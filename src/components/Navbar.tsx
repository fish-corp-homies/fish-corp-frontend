"use client";

import Link from "next/link";
import RetroButton from "@/components/RetroButton";

export default function Navbar() {

    return (
        <div className="outer-border">
            <nav className="flex justify-between w-full inner-border p-2">

                <Link href="/map">
                    {/*@ts-ignore*/}
                    <RetroButton> <div>Map</div> </RetroButton>
                </Link>

                <Link href="/">
                    {/*@ts-ignore*/}
                    <RetroButton> <div>Home</div> </RetroButton>
                </Link>

                <Link href="/about">
                    {/*@ts-ignore*/}
                    <RetroButton> <div>About</div> </RetroButton>
                </Link>
            </nav>
        </div>
            );
    };