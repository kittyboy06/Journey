"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/", label: "The Unsent Diary" },
    { href: "/daily-log", label: "Daily Log" },
    { href: "/photo-gallery", label: "Photo Gallery" },
    { href: "/liked-songs", label: "Liked Songs" },
    { href: "/timeline", label: "View Timeline" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home Link */}
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-foreground hover:text-secondary transition-colors duration-200"
          >
            The Unsent Diary
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-serif text-sm transition-colors duration-200 ${
                  isActive(link.href) ? "text-secondary font-semibold" : "text-foreground hover:text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-foreground hover:text-secondary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
