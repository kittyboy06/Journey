"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadSong(formData: FormData) {
  const supabase = await createClient()

  try {
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const spotifyUrl = formData.get("spotifyUrl") as string

    if (!title || !artist || !spotifyUrl) {
      return { error: "All fields are required" }
    }

    // Save to database
    const { error: dbError } = await supabase.from("songs").insert({
      title: title.trim(),
      artist: artist.trim(),
      spotify_embed_url: spotifyUrl.trim(),
    })

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return { error: dbError.message }
    }

    revalidatePath("/liked-songs")
    return { success: true }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return { error: error instanceof Error ? error.message : "Failed to save song" }
  }
}
