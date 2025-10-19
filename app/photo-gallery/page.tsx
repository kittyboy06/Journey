"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Trash2 } from "lucide-react"

interface PhotoItem {
  id: string
  url: string
  caption: string
}

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [caption, setCaption] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const savedPhotos = localStorage.getItem("galleryPhotos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }
  }, [])

  const savePhotosToStorage = (updatedPhotos: PhotoItem[]) => {
    localStorage.setItem("galleryPhotos", JSON.stringify(updatedPhotos))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newPhoto: PhotoItem = {
            id: `${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            caption: caption || "Untitled Photo",
          }
          const updatedPhotos = [...photos, newPhoto]
          setPhotos(updatedPhotos)
          savePhotosToStorage(updatedPhotos)
          setCaption("")
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const deletePhoto = (id: string) => {
    const updatedPhotos = photos.filter((p) => p.id !== id)
    setPhotos(updatedPhotos)
    savePhotosToStorage(updatedPhotos)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-serif">Back</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold">Her Photo Gallery</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Upload Section */}
      <section className="px-4 py-12 md:py-16 border-b border-border">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">Upload New Photo</h2>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="font-serif font-semibold text-foreground">Drop photos here or click to upload</p>
                <p className="font-serif text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-3">
            <label className="font-serif text-sm font-semibold text-foreground">Photo Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for this photo..."
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Photo
          </Button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground text-lg">
                No photos yet. Upload your first photo to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">Gallery ({photos.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="font-serif text-sm text-foreground mt-3 font-semibold">{photo.caption}</p>
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
