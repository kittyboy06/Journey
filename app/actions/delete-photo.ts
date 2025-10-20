"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deletePhoto(photoId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("photos").delete().eq("id", photoId)

    if (error) {
      console.error("[v0] Delete error:", error)
      return { error: error.message }
    }

    revalidatePath("/photo-gallery")
    return { success: true }
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return { error: error instanceof Error ? error.message : "Failed to delete photo" }
  }
}
