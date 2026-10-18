import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { compressImage, formatBytes } from './imageCompressor';

const BUCKET_NAME = 'portfolio-assets';

/**
 * Uploads an image to Supabase Storage with automatic compression & resizing.
 * @param {File} file - Original user-selected file
 * @param {string} folder - Destination folder ('covers' | 'casestudies' | 'general')
 * @returns {Promise<{ success: boolean, url: string, error?: string, sizeInfo?: string }>}
 */
export const uploadImageToStorage = async (file, folder = 'general') => {
  if (!file) {
    return { success: false, error: 'No image file provided.' };
  }

  const originalSize = file.size;

  try {
    // 1. Automatically resize and compress image
    const compressed = await compressImage(file, {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.85,
      outputType: 'image/webp',
    });

    const compressedSize = compressed.size;
    const sizeInfo = `Compressed from ${formatBytes(originalSize)} to ${formatBytes(compressedSize)}`;

    // 2. If Supabase is configured, upload directly to Supabase Storage bucket
    if (isSupabaseConfigured && supabase) {
      const cleanName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 32);
      const filePath = `${folder}/${Date.now()}-${cleanName}.webp`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, compressed, {
          contentType: 'image/webp',
          upsert: true,
          cacheControl: '31536000', // 1 year cache for blazing speed
        });

      if (error) {
        // If the bucket doesn't exist yet, provide helpful message
        const isBucketNotFound = error.message?.toLowerCase().includes('bucket') || error.statusCode === '404';
        const errorMsg = isBucketNotFound
          ? `Supabase bucket '${BUCKET_NAME}' not found. Please create a public bucket named '${BUCKET_NAME}' in your Supabase dashboard under Storage.`
          : `Storage upload error: ${error.message}`;

        return {
          success: false,
          error: errorMsg,
          sizeInfo,
        };
      }

      // Get permanent public CDN URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        sizeInfo,
      };
    }

    // 3. Fallback when Supabase is not yet configured:
    // Read the compressed WebP blob as a data URL so user can still preview and test locally
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target.result,
          sizeInfo: `${sizeInfo} (Cloud storage inactive, saved as optimized local WebP)`,
          warning: 'Cloud storage is inactive. To store images on a public CDN, configure VITE_SUPABASE_URL and create the portfolio-assets bucket.',
        });
      };
      reader.readAsDataURL(compressed);
    });
  } catch (err) {
    return {
      success: false,
      error: `Failed to process image: ${err.message || 'Unknown compression error'}`,
    };
  }
};
