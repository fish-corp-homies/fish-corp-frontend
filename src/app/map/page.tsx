import Location from "@/components/Location";
import {redirect} from "next/navigation";

export default function Page() {

    async function getUserDefinedCords(formData: FormData) {
        'use server'

        const rawFormData = {
            lon: formData.get('lon')?.toString(),
            lat: formData.get('lat')?.toString()
        }
        redirect(`/map/${rawFormData.lon}`)
    }
    return (
        <>
            <div className="text-center bg-gray-400">
                <h1 className="text-xl font-semibold">Cords</h1>

                <form className="flex flex-col gap-3 mt-5" action={getUserDefinedCords}>
                    <p>Breddegrad:</p>
                    <input
                        type="text"
                        name="lon"
                        placeholder="60.1"
                        className="px-3 py-2 rounded border"
                    />

                    <p>Lengdegrad:</p>
                    <input
                        type="text"
                        name="lat"
                        placeholder="5"
                        className="px-3 py-2 rounded border"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Insert here
                    </button>
                </form>
            </div>
        </>
    );
}