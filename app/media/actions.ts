// app/media/actions.ts or app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServerActionClient } from '@/lib/supabase'; // Assume a function to get a server client

// Define the Supabase Storage Bucket name
const PHOTO_BUCKET = 'her-photos'; 

// This action is called directly from your photo upload form component
export async function uploadPhotoAndSave(formData: FormData) {
  // 1. Extract data from the form
  const file = formData.get('file') as File;
  const caption = formData.get('caption') as string;
  const logId = formData.get('logId') as string; // UUID of the current log entry

  if (!file || file.size === 0) {
    return { error: 'No file provided for upload.' };
  }
  if (!logId) {
      return { error: 'Cannot link photo: Missing log entry ID.' };
  }

  // 2. Define the file path (ensures files are organized by log entry)
  const filePath = `${logId}/${Date.now()}-${file.name}`; 
  const supabase = supabaseServerActionClient();

  try {
    // 3. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(filePath, file);

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      return { error: `Photo upload failed: ${storageError.message}` };
    }

    // 4. Save Link to Database ('media_items' table)
    const { error: dbError } = await supabase.from('media_items').insert({
      log_id: logId,
      type: 'photo',
      title: caption,
      embed_or_url: filePath, // Store the path, not the full URL
      artist_or_source: 'Supabase Storage',
    });

    if (dbError) {
      console.error('Database Insert Error:', dbError);
      return { error: `Database link failed: ${dbError.message}` };
    }

    // 5. Revalidate to show the new photo immediately
    revalidatePath('/gallery');
    return { success: true };

  } catch (error) {
    console.error('Upload Process Error:', error);
    return { error: 'An unexpected error occurred during upload.' };
  }
}
