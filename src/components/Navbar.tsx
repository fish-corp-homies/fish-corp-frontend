import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="flex justify-between w-full bg-[#008080]">

            <Link href="/map">Map</Link>

            <Link href="/">
                <Image
                    src="/image1.png"
                    alt="Home"
                    width={80}
                    height={80}
                />

            </Link>

            <Link href="/about">About</Link>
        </nav>
    );
}