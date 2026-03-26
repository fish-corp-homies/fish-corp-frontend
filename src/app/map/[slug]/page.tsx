'use client'
import {use} from 'react'

export default function LocationPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = use(params)

    return (
        <div>
            <p>{slug}</p>
        </div>
    )
}