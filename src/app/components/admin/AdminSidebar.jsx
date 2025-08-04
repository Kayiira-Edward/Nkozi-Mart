"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h18v4H3V3zm0 7h18v11H3V10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15a7.9 7.9 0 01.6-6 8 8 0 01-7.9 7.9 7.9 7.9 0 016-.6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="flex-col hidden w-64 min-h-screen p-6 bg-[#f0f8f0] border-r border-[#c8e6c9] shadow-sm lg:flex">
        <h2 className="mb-8 text-2xl font-bold text-[#385e3a]">Admin Panel</h2>
        <nav className="flex-grow space-y-4">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-[#385e3a] hover:bg-[#e0f2e0] transition",
                pathname === href && "bg-[#d4edda] text-[#2e4d30] font-semibold"
              )}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 mt-auto text-left text-[#f44336] transition rounded-lg hover:bg-[#ffebee] hover:text-[#c62828]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 16v1a2 2 0 002 2h6a2 2 0 002-2v-1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 bg-[#f0f8f0] border-t border-[#c8e6c9] shadow-md lg:hidden">
        {navLinks.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center text-xs text-[#385e3a] hover:text-[#2e4d30] transition",
              pathname === href && "text-[#4caf50] font-semibold"
            )}
          >
            {icon}
            <span className="text-[11px] mt-1">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}