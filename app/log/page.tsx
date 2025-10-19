"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MediaInput } from "@/components/media-input"
import { MoodAnalyzer } from "@/components/mood-analyzer"
import { ArrowLeft, Save, Music, Film } from "lucide-react"

export default function LogPage() {
  const [title, setTitle] = useState("")
  const [logDate, setLogDate] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [mediaFiles, setMediaFiles] = useState([])
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [reelUrl, setReelUrl] = useState("")
  const [isRepostedReel, setIsRepostedReel] = useState(false)
  const [aiReflection, setAiReflection] = useState<{
    emotionalTag: string
    summary: string
    question: string
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleAiReflectionUpdate = (mood: string, analysis: string) => {
    // Parse AI response to extract reflection data
    // This is a simplified version - in production, you'd parse the actual AI response
    setSelectedMood(mood)
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
      mood: selectedMood || "Unspecified",
      date: new Date().toISOString(),
      mediaCount: mediaFiles.length,
      spotifyUrl,
      reelUrl,
      isRepostedReel,
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
    alert("Entry saved successfully!")
    setTitle("")
    setLogDate("")
    setContent("")
    setSelectedMood("")
    setMediaFiles([])
    setSpotifyUrl("")
    setReelUrl("")
    setIsRepostedReel(false)
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
          <h1 className="font-serif text-2xl font-bold">New Entry</h1>
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
                <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide">One-Sentence Summary</p>
                <div className="px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground text-sm opacity-75 cursor-not-allowed">
                  {aiReflection.summary}
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

          {/* Media Input */}
          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Attach Photos or Videos</label>
            <MediaInput onMediaChange={setMediaFiles} maxFiles={5} />
          </div>

          <div className="space-y-6 pt-4 border-t border-border">
            <h3 className="font-serif text-sm font-semibold text-foreground">Attach External Media</h3>

            {/* Spotify Embed */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-accent" />
                <label className="font-serif text-sm font-semibold text-foreground">Spotify Embed URL</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="Paste Spotify embed URL..."
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Button
                  onClick={() => {
                    if (spotifyUrl.trim()) {
                      alert("Song saved!")
                    }
                  }}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-6"
                >
                  Save Song
                </Button>
              </div>
            </div>

            {/* Reel Embed */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-accent" />
                <label className="font-serif text-sm font-semibold text-foreground">Reel URL / Embed Tag</label>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={reelUrl}
                    onChange={(e) => setReelUrl(e.target.value)}
                    placeholder="Paste Reel URL or embed tag..."
                    className="flex-1 px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <Button
                    onClick={() => {
                      if (reelUrl.trim()) {
                        alert("Reel saved!")
                      }
                    }}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-6"
                  >
                    Save Reel
                  </Button>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRepostedReel}
                    onChange={(e) => setIsRepostedReel(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-card cursor-pointer"
                  />
                  <span className="font-serif text-sm text-foreground">Reposted Reel</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Entry"}
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
