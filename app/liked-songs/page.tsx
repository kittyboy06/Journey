"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import LikedSongsDisplay from "@/components/liked-songs-display"

export default function LikedSongsPage() {
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [logId, setLogId] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLogId = params.get("logId")
    if (urlLogId) {
      setLogId(urlLogId)
    } else {
      setLogId(`log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [])

  const handleSaveSong = async () => {
    if (!spotifyUrl.trim()) {
      setError("Please enter a Spotify URL")
      return
    }

    if (!title.trim() || !artist.trim()) {
      setError("Please enter song title and artist name")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const { error: dbError } = await supabase.from("songs").insert({
        title: title.trim(),
        artist: artist.trim(),
        spotify_embed_url: spotifyUrl.trim(),
      })

      if (dbError) throw dbError

      setSpotifyUrl("")
      setTitle("")
      setArtist("")
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save song")
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="font-serif text-2xl font-bold">Liked Songs</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Input Section */}
      <section className="px-4 py-12 md:py-16 border-b border-border">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">Add a Song</h2>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveSong()
            }}
          >
            <input type="hidden" name="logId" value={logId} />
            <input type="hidden" name="mediaType" value="liked_song" />

            <div className="space-y-2">
              <label className="font-serif text-sm font-semibold text-foreground">Song Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError("")
                }}
                placeholder="Enter song title..."
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="font-serif text-sm font-semibold text-foreground">Artist Name</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => {
                  setArtist(e.target.value)
                  setError("")
                }}
                placeholder="Enter artist name..."
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="font-serif text-sm font-semibold text-foreground">Spotify Embed URL</label>
              <input
                type="url"
                value={spotifyUrl}
                onChange={(e) => {
                  setSpotifyUrl(e.target.value)
                  setError("")
                }}
                placeholder="Paste Spotify track URL..."
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-destructive font-serif">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
            >
              {isLoading ? "Saving..." : "Save Song"}
            </Button>
          </form>
        </div>
      </section>

      {/* Songs List Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Your Songs</h2>
          <LikedSongsDisplay key={refreshKey} />
        </div>
      </section>
    </main>
  )
}
