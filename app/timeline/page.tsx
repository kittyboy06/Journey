"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"

interface DiaryEntry {
  id: number
  title: string
  content: string
  mood: string
  date: string
  mediaCount: number
}

const MOOD_COLORS: Record<string, string> = {
  Happy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Angry: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Anxious: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Longing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  Peaceful: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Confused: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Hopeful: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  Unspecified: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export default function TimelinePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
    const sorted = savedEntries.sort(
      (a: DiaryEntry, b: DiaryEntry) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    setEntries(sorted)
    setIsLoading(false)
  }, [])

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updated = entries.filter((e) => e.id !== id)
      setEntries(updated)
      localStorage.setItem("diaryEntries", JSON.stringify(updated))

      // Update stats
      const stats = JSON.parse(localStorage.getItem("diaryStats") || "{}")
      stats.totalEntries = Math.max(0, (stats.totalEntries || 1) - 1)
      localStorage.setItem("diaryStats", JSON.stringify(stats))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-serif">Back</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold">Timeline</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Timeline Content */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-lg text-muted-foreground mb-6">No entries yet</p>
              <Link href="/log">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif">
                  Create Your First Entry
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry, index) => (
                <div key={entry.id} className="flex gap-6">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-background" />
                    {index < entries.length - 1 && <div className="w-1 bg-border flex-1 min-h-24" />}
                  </div>

                  {/* Entry Card */}
                  <div className="flex-1 pb-6">
                    <Card className="p-6 border-border bg-card hover:bg-card/80 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-2">{entry.title}</h3>
                          <p className="font-serif text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2"
                          title="Delete entry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mood Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-serif text-xs font-semibold ${
                            MOOD_COLORS[entry.mood] || MOOD_COLORS.Unspecified
                          }`}
                        >
                          {entry.mood}
                        </span>
                      </div>

                      {/* Entry Content */}
                      <p className="font-serif text-foreground leading-relaxed mb-4 line-clamp-4">{entry.content}</p>

                      {/* Media Indicator */}
                      {entry.mediaCount > 0 && (
                        <div className="text-xs text-muted-foreground mb-4">
                          📎 {entry.mediaCount} file{entry.mediaCount !== 1 ? "s" : ""} attached
                        </div>
                      )}

                      {/* Read More Link */}
                      <Link href={`/entry/${entry.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent text-accent hover:bg-accent/10 font-serif bg-transparent"
                        >
                          Read Full Entry
                        </Button>
                      </Link>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
