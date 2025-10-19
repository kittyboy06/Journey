"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface MediaFile {
  id: string
  file: File
  preview: string
  type: "image" | "video"
}

interface MediaInputProps {
  onMediaChange?: (files: MediaFile[]) => void
  maxFiles?: number
}

export function MediaInput({ onMediaChange, maxFiles = 5 }: MediaInputProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: MediaFile[] = []

    files.forEach((file) => {
      if (mediaFiles.length + validFiles.length >= maxFiles) return

      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (isImage || isVideo) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newFile: MediaFile = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: event.target?.result as string,
            type: isImage ? "image" : "video",
          }
          setMediaFiles((prev) => {
            const updated = [...prev, newFile]
            onMediaChange?.(updated)
            return updated
          })
        }
        reader.readAsDataURL(file)
      }
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      onMediaChange?.(updated)
      return updated
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-accent", "bg-accent/5")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-accent", "bg-accent/5")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-accent", "bg-accent/5")
    const files = e.dataTransfer.files
    if (fileInputRef.current) {
      fileInputRef.current.files = files
      handleFileSelect({ target: fileInputRef.current } as any)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-accent/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="font-serif font-semibold text-foreground">Drop media here or click to upload</p>
            <p className="font-serif text-sm text-muted-foreground">Images and videos up to {maxFiles} files</p>
          </div>
        </div>
      </div>

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="space-y-3">
          <p className="font-serif text-sm font-semibold text-foreground">
            Attached Media ({mediaFiles.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaFiles.map((media) => (
              <div key={media.id} className="relative group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border">
                  {media.type === "image" ? (
                    <img
                      src={media.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={media.preview} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    {media.type === "video" && <div className="text-white text-3xl">▶</div>}
                  </div>
                </div>
                <button
                  onClick={() => removeMedia(media.id)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="font-serif text-xs text-muted-foreground mt-2 truncate">{media.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
