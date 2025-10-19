"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"

interface Reel {
  id: string
  reelUrl: string
  embedTag: string
  isReposted: boolean
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [reelUrl, setReelUrl] = useState("")
  const [embedTag, setEmbedTag] = useState("")
  const [isReposted, setIsReposted] = useState(false)
  const [logId, setLogId] = useState<string>("")
  const [error, setError] = useState("")

  useEffect(() => {
    const savedReels = localStorage.getItem("repostedReels")
    if (savedReels) {
      setReels(JSON.parse(savedReels))
    }
    // Initialize logId from URL or generate new one
    const params = new URLSearchParams(window.location.search)
    const urlLogId = params.get("logId")
    if (urlLogId) {
      setLogId(urlLogId)
    } else {
      setLogId(`log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [])

  const saveReelsToStorage = (updatedReels: Reel[]) => {
    localStorage.setItem("repostedReels", JSON.stringify(updatedReels))
  }

  const handleSaveReel = () => {
    if (!reelUrl.trim() || !embedTag.trim()) {
      setError("Please enter both Reel URL and Embed Tag")
      return
    }

    const mediaType = isReposted ? "reposted_reel" : "liked_reel"

    const newReel: Reel = {
      id: `${Date.now()}-${Math.random()}`,
      reelUrl,
      embedTag,
      isReposted,
    }

    const updatedReels = [...reels, newReel]
    setReels(updatedReels)
    saveReelsToStorage(updatedReels)
    setReelUrl("")
    setEmbedTag("")
    setIsReposted(false)
    setError("")
  }

  const deleteReel = (id: string) => {
    const updatedReels = reels.filter((r) => r.id !== id)
    setReels(updatedReels)
    saveReelsToStorage(updatedReels)
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
          <h1 className="font-serif text-2xl font-bold">Reposted Reels</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Input Section */}
      <section className="px-4 py-12 md:py-16 border-b border-border">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">Add a Reel</h2>

          <form className="space-y-4">
            <input type="hidden" name="logId" value={logId} />
            <input type="hidden" name="mediaType" value={isReposted ? "reposted_reel" : "liked_reel"} />

            <div className="space-y-3">
              <label className="font-serif text-sm font-semibold text-foreground">Reel URL / Embed Tag</label>
              <input
                type="text"
                value={reelUrl}
                onChange={(e) => {
                  setReelUrl(e.target.value)
                  setError("")
                }}
                placeholder="Paste reel URL or embed tag..."
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div className="space-y-3">
              <label className="font-serif text-sm font-semibold text-foreground">Embed Tag</label>
              <input
                type="text"
                value={embedTag}
                onChange={(e) => {
                  setEmbedTag(e.target.value)
                  setError("")
                }}
                placeholder="Enter embed tag or code..."
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border">
              <input
                type="checkbox"
                id="reposted-toggle"
                checked={isReposted}
                onChange={(e) => setIsReposted(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label
                htmlFor="reposted-toggle"
                className="font-serif text-sm font-semibold text-foreground cursor-pointer flex-1"
              >
                Reposted Reel
              </label>
              <span className="font-serif text-xs text-muted-foreground">{isReposted ? "Reposted" : "Original"}</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSaveReel}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
              >
                Save Reel
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-serif">{error}</p>}
          </form>
        </div>
      </section>

      {/* Reels List Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {reels.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground text-lg">
                No reels yet. Add your first reel to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">Your Reels ({reels.length})</h2>
              <div className="space-y-4">
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-serif font-semibold text-foreground">Reel</p>
                          <span
                            className={`text-xs font-serif px-2 py-1 rounded ${
                              reel.isReposted ? "bg-accent/20 text-accent" : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {reel.isReposted ? "Reposted" : "Original"}
                          </span>
                        </div>
                        <p className="font-serif text-sm text-muted-foreground break-all">{reel.reelUrl}</p>
                        <p className="font-serif text-xs text-muted-foreground">Embed: {reel.embedTag}</p>
                      </div>
                      <button
                        onClick={() => deleteReel(reel.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
