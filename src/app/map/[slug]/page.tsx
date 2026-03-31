'use client'
import { useParams } from 'next/navigation'

export function generateStaticParams() {
    return []
}

export default function LocationPage() {
    const { slug } = useParams()
    return (
        <div>
            <p>{slug}</p>
        </div>
    )
}
