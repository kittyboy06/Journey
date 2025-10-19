"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function Home() {
  const [stats, setStats] = useState({
    daysLogged: 0,
    mostCommonMood: "—",
    lastIncidentDate: "—",
    totalEntries: 0,
  })

  useEffect(() => {
    // Simulate loading stats from localStorage or API
    const savedStats = localStorage.getItem("diaryStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Default stats for first visit
      setStats({
        daysLogged: 24,
        mostCommonMood: "Longing",
        lastIncidentDate: "Oct 18, 2025",
        totalEntries: 47,
      })
    }
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-balance leading-tight">The Unsent Diary</h1>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground text-balance">
            College Years: A space to capture the moments you'll never share
          </p>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard label="Days Logged" value={stats.daysLogged.toString()} />
          <StatisticCard label="Total Entries" value={stats.totalEntries.toString()} />
          <StatisticCard label="Most Common Mood" value={stats.mostCommonMood} />
          <StatisticCard label="Last Entry" value={stats.lastIncidentDate} />
        </div>
      </section>

      {/* Quick Stats Summary */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">Your Journey</h2>
            <p className="font-serif text-muted-foreground leading-relaxed">
              You've been documenting your college years for {stats.daysLogged} days. Each entry is a moment frozen in
              time—a feeling, a thought, a memory you've chosen to preserve. Keep writing. Your story matters.
            </p>
          </Card>
        </div>
      </section>

      {/* Navigation Buttons */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/daily-log">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif"
            >
              Start Daily Log
            </Button>
          </Link>
          <Link href="/timeline">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 font-serif bg-transparent"
            >
              View Timeline
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-4 py-8 md:py-12 border-t border-border">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/photo-gallery">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-card font-serif bg-transparent"
            >
              Photo Gallery
            </Button>
          </Link>
          <Link href="/liked-songs">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-card font-serif bg-transparent"
            >
              Liked Songs
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function StatisticCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6 text-center border-border bg-card hover:bg-card/80 transition-colors">
      <p className="font-serif text-xs md:text-sm text-muted-foreground mb-2 uppercase tracking-wide">{label}</p>
      <p className="font-serif text-2xl md:text-3xl font-bold text-foreground">{value}</p>
    </Card>
  )
}
