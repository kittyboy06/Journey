"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { deleteSong } from "@/app/actions/delete-song"

interface Song {
  id: string
  title: string
  artist: string
  spotify_embed_url: string
  created_at: string
}

export default function LikedSongsDisplay() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setSongs(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load songs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSong = async (id: string) => {
    try {
      setDeletingId(id)
      const result = await deleteSong(id)

      if (result.error) {
        setError(result.error)
      } else {
        setSongs(songs.filter((song) => song.id !== id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete song")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-serif text-muted-foreground">Loading songs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-serif text-destructive">{error}</p>
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-serif text-muted-foreground">No songs yet. Add your first song to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {songs.map((song) => (
        <Card key={song.id} className="p-6 border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-foreground truncate">{song.title}</h3>
              <p className="font-serif text-sm text-muted-foreground truncate">{song.artist}</p>
            </div>
            <button
              onClick={() => handleDeleteSong(song.id)}
              disabled={deletingId === song.id}
              className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
              aria-label="Delete song"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>

          <div className="bg-muted rounded-lg p-4 flex items-center justify-center" style={{ height: "152px" }}>
            {song.spotify_embed_url ? (
              <iframe
                src={song.spotify_embed_url}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded"
              />
            ) : (
              <p className="font-serif text-sm text-muted-foreground text-center">Spotify Player Embed Area</p>
            )}
          </div>

          <p className="font-serif text-xs text-muted-foreground mt-3">
            Added {new Date(song.created_at).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  )
}
