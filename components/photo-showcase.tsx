"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { deletePhoto } from "@/app/actions/delete-photo"

interface Photo {
  id: string
  caption: string
  image_url: string
  created_at: string
}

export default function PhotoShowcase() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("photos").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    try {
      setDeletingId(id)
      const result = await deletePhoto(id)

      if (result.error) {
        setError(result.error)
      } else {
        setPhotos(photos.filter((photo) => photo.id !== id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-serif text-muted-foreground">Loading photos...</p>
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

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-serif text-muted-foreground">No photos yet. Upload your first photo to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden border-border bg-card hover:shadow-lg transition-shadow">
          <div className="relative w-full aspect-square overflow-hidden bg-muted">
            <img
              src={photo.image_url || "/placeholder.svg"}
              alt={photo.caption}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleDeletePhoto(photo.id)}
              disabled={deletingId === photo.id}
              className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors disabled:opacity-50"
              aria-label="Delete photo"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>

          <div className="p-4">
            <p className="font-serif text-sm text-foreground line-clamp-2">{photo.caption}</p>
            <p className="font-serif text-xs text-muted-foreground mt-2">
              {new Date(photo.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
