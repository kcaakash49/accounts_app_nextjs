"use client"

export default function ({ label, func }: { label: string, func: any }) {
    return (
        <div>
            <button className="bg-blue-700 text-white p-4 rounded-3xl hover:bg-blue-500 cursor-pointer " onClick={func}>{label}</button>
        </div>
    )
}