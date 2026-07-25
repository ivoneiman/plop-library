"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    href: "/catalogo",
    label: "Catálogo",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.5C10.5 5.2 8.2 4.5 5.5 4.5c-.8 0-1.5.7-1.5 1.5v11c0 .8.7 1.5 1.5 1.5 2.7 0 5 .7 6.5 2 1.5-1.3 3.8-2 6.5-2 .8 0 1.5-.7 1.5-1.5v-11c0-.8-.7-1.5-1.5-1.5-2.7 0-5 .7-6.5 2Zm0 0v13"
        />
      </svg>
    ),
  },
  {
    href: "/regaleria",
    label: "Regalería",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Zm-1-3.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5V9H3V5.5ZM12 4v17M12 9c-1.5-3-5-3-5-1s2 2 5 1Zm0 0c1.5-3 5-3 5-1s-2 2-5 1Z"
        />
      </svg>
    ),
  },
  {
    href: "/fotocopias",
    label: "Copias",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9V4h9l3 3v2M6 9H4.5A1.5 1.5 0 0 0 3 10.5v6A1.5 1.5 0 0 0 4.5 18H6m0-9h12a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H18M6 14h12v6H6v-6Z"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t-2 border-kraft-200 bg-paper-100 px-2 py-2 md:hidden">
      {tabs.map((tab) => {
        const activo = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-1 transition-colors active:translate-y-0.5 ${
              activo ? "bg-mustard-500 text-mustard-900" : "text-kraft-500"
            }`}
          >
            {tab.icono}
            <span className="text-xs font-bold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
