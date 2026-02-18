"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "#" },
    { name: "Settings", href: "#" },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
      <h2 className="text-2xl font-bold mb-10">CorePanel</h2>

      <nav className="space-y-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.href
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
