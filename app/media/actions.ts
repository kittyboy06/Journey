// app/media/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
// ASSUMPTION: This utility file exists and is correctly configured!
import { supabaseServerActionClient } from '@/lib/supabase.server'; 

// --- Configuration ---
const PHOTO_BUCKET = 'her-photos'; 

// --- 1. Photo Upload and Save Action ---
// Handles file upload to Storage and database record creation for photos.
export async function uploadPhotoAndSave(formData: FormData) {
  // 1. Extract data from the form
  const file = formData.get('file') as File;
  const caption = formData.get('caption') as string;
  const logId = formData.get('logId') as string;

  if (!file || file.size === 0) {
    return { error: 'No file provided for upload.' };
  }
  if (!logId) {
      return { error: 'Cannot link photo: Missing log entry ID.' };
  }

  // 2. Initialize Server Client
  const supabase = supabaseServerActionClient();
  const filePath = `${logId}/${Date.now()}-${file.name}`; 

  try {
    // 3. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (storageError) {
      console.error('Storage Error:', storageError);
      return { error: `Photo upload failed: ${storageError.message}` };
    }

    // 4. Save Link to Database ('media_items' table)
    const { error: dbError } = await supabase.from('media_items').insert({
      log_id: logId,
      type: 'photo',
      title: caption,
      embed_or_url: filePath, // Store the storage path
      artist_or_source: 'Supabase Storage',
    });

    if (dbError) {
      console.error('Database Insert Error:', dbError);
      return { error: `Database link failed: ${dbError.message}` };
    }

    revalidatePath('/gallery');
    return { success: true };

  } catch (error) {
    return { error: 'An unexpected error occurred during photo upload.' };
  }
}

// --- 2. Embed Link and Data Save Action ---
// Handles saving embed links for songs and reels directly to the database.
export async function saveEmbedLink(formData: FormData) {
  const url = formData.get('url') as string;
  const logId = formData.get('logId') as string;
  const mediaType = formData.get('mediaType') as string; 
  const title = formData.get('title') as string; 
  const artistOrSource = formData.get('artistOrSource') as string;

  if (!url || !logId || !mediaType) {
    return { error: 'Missing required link, log ID, or media type.' };
  }
  
  // Type validation for safety
  const validTypes = ['liked_song', 'liked_reel', 'reposted_reel'];
  if (!validTypes.includes(mediaType)) {
      return { error: `Invalid media type: ${mediaType}` };
  }

  const supabase = supabaseServerActionClient();

  try {
    // A. Insert record into 'media_items' table
    const { error } = await supabase.from('media_items').insert({
      log_id: logId,
      type: mediaType,
      title: title || 'Untitled Media',
      artist_or_source: artistOrSource,
      embed_or_url: url, // Store the clean embed URL/tag
    });

    if (error) {
      console.error('Database Insert Error:', error);
      return { error: `Database save failed: ${error.message}` };
    }
    
    // B. Revalidate the display page
    const pathToRevalidate = mediaType.includes('song') ? '/songs' : '/reels';
    revalidatePath(pathToRevalidate); 
    
    return { success: true };

  } catch (error) {
    return { error: 'An unexpected error occurred during embed save.' };
  }
}
