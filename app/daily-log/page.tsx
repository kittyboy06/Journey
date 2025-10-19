"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoodAnalyzer } from "@/components/mood-analyzer"
import { ArrowLeft, Save } from "lucide-react"

export default function DailyLogPage() {
  const [title, setTitle] = useState("")
  const [logDate, setLogDate] = useState("")
  const [content, setContent] = useState("")
  const [aiReflection, setAiReflection] = useState<{
    emotionalTag: string
    summary: string
    question: string
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleAiReflectionUpdate = (mood: string, analysis: string) => {
    setAiReflection({
      emotionalTag: mood,
      summary: analysis.split(".")[0] + ".",
      question: "What does this moment mean to you?",
    })
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    setIsSaving(true)

    const entry = {
      id: Date.now(),
      title,
      logDate: logDate || new Date().toISOString().split("T")[0],
      content,
      mood: aiReflection?.emotionalTag || "Unspecified",
      date: new Date().toISOString(),
      aiReflection,
    }

    const existingEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
    existingEntries.push(entry)
    localStorage.setItem("diaryEntries", JSON.stringify(existingEntries))

    // Update stats
    const stats = JSON.parse(localStorage.getItem("diaryStats") || "{}")
    stats.totalEntries = (stats.totalEntries || 0) + 1
    stats.lastIncidentDate = new Date().toLocaleDateString()
    localStorage.setItem("diaryStats", JSON.stringify(stats))

    setIsSaving(false)
    alert("Daily log saved successfully!")
    setTitle("")
    setLogDate("")
    setContent("")
    setAiReflection(null)
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
          <h1 className="font-serif text-2xl font-bold">Daily Log</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Form */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title Input */}
          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Log Date Input */}
          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Log Date</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <p className="text-xs text-muted-foreground">MM/DD/YYYY format</p>
          </div>

          {/* Content Input */}
          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Your Story</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write what's on your mind. This is your space..."
              rows={12}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">{content.length} characters</p>
          </div>

          {/* AI Mood Analyzer */}
          <MoodAnalyzer
            title={title}
            content={content}
            onMoodDetected={(mood, analysis) => handleAiReflectionUpdate(mood, analysis || "")}
          />

          {/* AI Reflection Card - Disabled Display */}
          {aiReflection && (
            <div className="p-6 rounded-lg border border-accent/30 bg-accent/5 space-y-4">
              <h3 className="font-serif text-sm font-semibold text-foreground uppercase tracking-wide">
                AI Reflection
              </h3>

              <div className="space-y-2">
                <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide">Emotional Tag</p>
                <div className="px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground text-sm opacity-75 cursor-not-allowed">
                  {aiReflection.emotionalTag}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide">Reflection Question</p>
                <div className="px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground text-sm opacity-75 cursor-not-allowed">
                  {aiReflection.question}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Daily Log"}
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-border font-serif py-6 bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
