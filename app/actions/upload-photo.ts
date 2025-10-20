"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadPhoto(formData: FormData) {
  try {
    const supabase = await createClient()

    const file = formData.get("file") as File
    const caption = formData.get("caption") as string

    if (!file) {
      return { error: "No file provided" }
    }

    if (!caption) {
      return { error: "No caption provided" }
    }

    console.log("[v0] Starting photo upload:", { fileName: file.name, size: file.size })

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const filePath = `gallery/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("photos").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("[v0] Storage upload error:", uploadError)
      return { error: `Storage error: ${uploadError.message}` }
    }

    console.log("[v0] File uploaded successfully:", uploadData)

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath)

    console.log("[v0] Public URL generated:", publicUrlData.publicUrl)

    // Save metadata to database
    const { data: insertData, error: dbError } = await supabase.from("photos").insert({
      caption: caption.trim(),
      image_url: publicUrlData.publicUrl,
    })

    if (dbError) {
      console.error("[v0] Database insert error:", dbError)
      return { error: `Database error: ${dbError.message}` }
    }

    console.log("[v0] Photo metadata saved successfully")

    revalidatePath("/photo-gallery")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error in uploadPhoto:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to upload photo"
    return { error: errorMessage }
  }
}
