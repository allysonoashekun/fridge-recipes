"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Snap" },
  { href: "/saved", label: "Saved" },
  { href: "/pantry", label: "Pantry" },
];

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-xl px-2">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={`flex h-12 flex-1 items-center justify-center font-medium ${
              pathname === href ? "text-accent" : "text-muted"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
