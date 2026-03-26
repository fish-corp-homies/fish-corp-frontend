export default function LocationPage({params}: { params: { slug: string };}) {
    return (
        <div>
            <p>{params.slug}</p>
        </div>
    )
}