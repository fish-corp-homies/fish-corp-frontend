'use client';

import Link from "next/link";
import Window from "@/components/Window";

export default function Home() {

    return (
        <>
            <Window></Window>
            <Link href="/404">To the 404 page</Link>
        </>
    );
}