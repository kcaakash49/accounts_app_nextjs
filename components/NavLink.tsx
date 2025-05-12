import Link from "next/link";
import { ReactNode } from "react";

export default function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 rounded hover:bg-blue-400 transition text-white font-medium"
    >
      {children}
    </Link>
  );
}
