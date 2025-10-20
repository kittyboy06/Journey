"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload } from "lucide-react"
import PhotoShowcase from "@/components/photo-showcase"
import { uploadPhoto } from "@/app/actions/upload-photo"

export default function PhotoGalleryPage() {
  const [caption, setCaption] = useState("")
  const [logId, setLogId] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLogId = params.get("logId")
    if (urlLogId) {
      setLogId(urlLogId)
    } else {
      setLogId(`log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        try {
          setIsUploading(true)
          setError("")

          const formData = new FormData()
          formData.append("file", file)
          formData.append("caption", caption || "Untitled Photo")

          const result = await uploadPhoto(formData)

          if (result.error) {
            setError(result.error)
          } else {
            setCaption("")
            setRefreshKey((prev) => prev + 1)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to upload photo")
        } finally {
          setIsUploading(false)
        }
      }
    }
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

          <form className="space-y-6">
            <input type="hidden" name="logId" value={logId} />
            <input type="hidden" name="mediaType" value="photo" />

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
                disabled={isUploading}
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
                disabled={isUploading}
              />
            </div>

            {error && <p className="text-sm text-destructive font-serif">{error}</p>}

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif py-6"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Select Photo"}
            </Button>
          </form>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Gallery</h2>
          <PhotoShowcase key={refreshKey} />
        </div>
      </section>
    </main>
  )
}
