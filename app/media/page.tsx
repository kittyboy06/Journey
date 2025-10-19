"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function MediaPage() {
  const [photoCaption, setPhotoCaption] = useState("")
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [reelUrl, setReelUrl] = useState("")
  const [isReposted, setIsReposted] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/log">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold">Add Media</h1>
        </div>
      </div>

      {/* Media Form */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Column A: Photo */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold">Photo</h2>

            {/* Drag and Drop Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
              <p className="font-serif text-muted-foreground">Drag and drop your photo here</p>
              <p className="font-serif text-sm text-muted-foreground mt-2">or click to browse</p>
            </div>

            {/* Photo Caption */}
            <div className="space-y-2">
              <label className="font-serif text-sm font-medium text-muted-foreground">Photo Caption</label>
              <Input
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Add a caption for this photo..."
                className="font-serif bg-card border-border text-foreground"
              />
            </div>

            {/* Save Photo Button */}
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif"
              size="lg"
            >
              Save Photo
            </Button>
          </div>

          {/* Column B: Embeds */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold">Embeds</h2>

            {/* Spotify */}
            <div className="space-y-2">
              <label className="font-serif text-sm font-medium text-muted-foreground">Spotify Embed URL</label>
              <Input
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="Paste Spotify embed URL..."
                className="font-serif bg-card border-border text-foreground"
              />
            </div>

            {/* Save Song Button */}
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif"
              size="lg"
            >
              Save Song
            </Button>

            {/* Reel */}
            <div className="space-y-2 pt-4">
              <label className="font-serif text-sm font-medium text-muted-foreground">Reel URL</label>
              <Input
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                placeholder="Paste reel URL..."
                className="font-serif bg-card border-border text-foreground"
              />
            </div>

            {/* Reposted Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="reposted"
                checked={isReposted}
                onChange={(e) => setIsReposted(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="reposted" className="font-serif text-sm text-muted-foreground cursor-pointer">
                Reposted Reel
              </label>
            </div>

            {/* Save Reel Button */}
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif"
              size="lg"
            >
              Save Reel
            </Button>
          </div>
        </div>

        {/* Complete Button */}
        <div className="max-w-4xl mx-auto mt-12">
          <Link href="/timeline">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif" size="lg">
              Complete Entry
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
