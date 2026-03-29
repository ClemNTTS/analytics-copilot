"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark" | "slate";

const navItems = [
  { label: "Assistant", path: "/", icon: "💬" },
  { label: "Base de donnees", path: "/database", icon: "🗃️" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme | null;
    const nextTheme = savedTheme ?? "light";
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
  }, []);

  const toggleTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    localStorage.setItem("app-theme", nextTheme);
    document.documentElement.className = nextTheme;
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        theme === "dark"
          ? "bg-zinc-950 text-zinc-100 dark"
          : theme === "slate"
            ? "bg-slate-50 text-slate-950 slate"
            : "bg-white text-zinc-900 light"
      }`}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-300 ease-in-out lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800"
            : theme === "slate"
              ? "bg-slate-950 border-slate-800 text-white"
              : "bg-zinc-50 border-zinc-200"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              AC
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
                Demo
              </p>
              <span className="text-xl font-bold tracking-tight">
                Analytics Copilot
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                    isActive
                      ? theme === "dark"
                        ? "bg-zinc-800 text-blue-400"
                        : theme === "slate"
                          ? "bg-slate-800 text-blue-300"
                          : "bg-blue-50 text-blue-700"
                      : theme === "dark"
                        ? "hover:bg-zinc-800"
                        : theme === "slate"
                          ? "hover:bg-slate-800"
                          : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-200/20 pt-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest opacity-50">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => toggleTheme("light")}
                className={`rounded-lg border p-2 text-xs font-bold ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-200"
                }`}
              >
                Clair
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className={`rounded-lg border p-2 text-xs font-bold ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800"
                }`}
              >
                Sombre
              </button>
              <button
                onClick={() => toggleTheme("slate")}
                className={`rounded-lg border p-2 text-xs font-bold ${
                  theme === "slate"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-800"
                }`}
              >
                Slate
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b p-4 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-bold">Analytics Copilot</span>
          <div className="w-8" />
        </header>

        {children}
      </main>
    </div>
  );
}
