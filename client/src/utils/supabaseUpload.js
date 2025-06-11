import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Upload a base64 image to Supabase Storage and return the public URL
 * @param {string} base64Data - The image as a base64 data URL (data:image/png;base64,...)
 * @param {string} userId - User ID to namespace the upload
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadBase64ToSupabase(base64Data, userId) {
  if (!base64Data.startsWith('data:image/')) {
    throw new Error('Invalid base64 image data');
  }
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 format');
  const ext = matches[1].split('/')[1];
  const data = matches[2];
  const buffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const fileName = `pixelart_${userId}_${Date.now()}.${ext}`;
  const filePath = `${userId}/${fileName}`;

  // Upload to 'images' bucket
  const { error } = await supabase.storage.from('images').upload(filePath, buffer, {
    contentType: `image/${ext}`,
    upsert: false
  });
  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
  if (!publicUrlData || !publicUrlData.publicUrl) throw new Error('Failed to get public URL');
  return publicUrlData.publicUrl;
}
