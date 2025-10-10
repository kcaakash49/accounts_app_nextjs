import Link from "next/link";


export default async function LinkButton({ href, label }: { href: string, label: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
            {label}
        </Link>

    )
}