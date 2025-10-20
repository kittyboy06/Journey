"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteSong(songId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("songs").delete().eq("id", songId)

    if (error) {
      console.error("[v0] Delete error:", error)
      return { error: error.message }
    }

    revalidatePath("/liked-songs")
    return { success: true }
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return { error: error instanceof Error ? error.message : "Failed to delete song" }
  }
}
