"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"

interface Song {
  id: string
  spotifyUrl: string
  title: string
  artist: string
}

export default function LikedSongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const savedSongs = localStorage.getItem("likedSongs")
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs))
    }
  }, [])

  const saveSongsToStorage = (updatedSongs: Song[]) => {
    localStorage.setItem("likedSongs", JSON.stringify(updatedSongs))
  }

  const extractSpotifyInfo = (url: string) => {
    // Extract track ID from Spotify URL
    const match = url.match(/track\/([a-zA-Z0-9]+)/)
    if (match) {
      return match[1]
    }
    return null
  }

  const handleSaveSong = () => {
    if (!spotifyUrl.trim()) {
      setError("Please enter a Spotify URL")
      return
    }

    const trackId = extractSpotifyInfo(spotifyUrl)
    if (!trackId) {
      setError("Invalid Spotify URL. Please use a valid track link.")
      return
    }

    // Parse title and artist from URL or use defaults
    const newSong: Song = {
      id: `${Date.now()}-${Math.random()}`,
      spotifyUrl,
      title: "Song Title",
      artist: "Artist Name",
    }

    const updatedSongs = [...songs, newSong]
    setSongs(updatedSongs)
    saveSongsToStorage(updatedSongs)
    setSpotifyUrl("")
    setError("")
  }

  const deleteSong = (id: string) => {
    const updatedSongs = songs.filter((s) => s.id !== id)
    setSongs(updatedSongs)
    saveSongsToStorage(updatedSongs)
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

          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Spotify Embed URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={spotifyUrl}
                onChange={(e) => {
                  setSpotifyUrl(e.target.value)
                  setError("")
                }}
                placeholder="Paste Spotify track URL..."
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <Button
                onClick={handleSaveSong}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-6"
              >
                Save Song
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-serif">{error}</p>}
          </div>
        </div>
      </section>

      {/* Songs List Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {songs.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground text-lg">
                No songs yet. Add your first song to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">Your Songs ({songs.length})</h2>
              <div className="space-y-4">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <p className="font-serif font-semibold text-foreground">{song.title}</p>
                        <p className="font-serif text-sm text-muted-foreground">{song.artist}</p>
                      </div>
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Spotify Embed Placeholder */}
                    <div
                      className="mt-4 bg-muted/30 rounded-lg border border-border flex items-center justify-center"
                      style={{ height: "152px" }}
                    >
                      <div className="text-center">
                        <p className="font-serif text-sm text-muted-foreground">Spotify Embed</p>
                        <p className="font-serif text-xs text-muted-foreground mt-1">152px height</p>
                      </div>
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
