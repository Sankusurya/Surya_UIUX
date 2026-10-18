import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET_NAME = 'portfolio-assets';

/** Format bytes to human-readable string, e.g. "1.4 MB" */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Read the natural pixel dimensions of a File/Blob without modifying it.
 * @param {File} file
 * @returns {Promise<{ width: number, height: number }>}
 */
export const getImageDimensions = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });

/**
 * Uploads an image to Supabase Storage in 100% full original quality (no compression or downscaling).
 * Essential for UI/UX case studies so Figma mockups, wireframes, charts, and typography remain pixel-perfect.
 * @param {File} file - Original user-selected file
 * @param {string} folder - Destination folder ('covers' | 'casestudies' | 'general')
 * @returns {Promise<{ success: boolean, url: string, error?: string, sizeInfo?: string, width?: number, height?: number }>}
 */
export const uploadImageToStorage = async (file, folder = 'general') => {
  if (!file) {
    return { success: false, error: 'No image file provided.' };
  }

  const originalSize = file.size;
  const sizeInfo = `100% Original Quality (${formatBytes(originalSize)})`;

  // Read natural dimensions before uploading
  const { width, height } = await getImageDimensions(file);

  try {
    // 1. If Supabase is configured, upload the exact original file directly to Supabase Storage
    if (isSupabaseConfigured && supabase) {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const baseName = file.name
        .substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 32);

      const filePath = `${folder}/${Date.now()}-${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          contentType: file.type || 'image/png',
          upsert: true,
          cacheControl: '31536000', // 1 year cache
        });

      if (error) {
        const isBucketNotFound = error.message?.toLowerCase().includes('bucket') || error.statusCode === '404';
        const errorMsg = isBucketNotFound
          ? `Supabase bucket '${BUCKET_NAME}' not found. Please create a public bucket named '${BUCKET_NAME}' in your Supabase dashboard under Storage.`
          : `Storage upload error: ${error.message}`;

        return {
          success: false,
          error: errorMsg,
          sizeInfo,
          width,
          height,
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
        width,
        height,
      };
    }

    // 2. Fallback when Supabase is not yet configured:
    // Read the exact original file as a data URL without any downscaling or quality loss
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target.result,
          sizeInfo: `${sizeInfo} (Saved in original resolution)`,
          width,
          height,
        });
      };
      reader.readAsDataURL(file);
    });
  } catch (err) {
    return {
      success: false,
      error: `Failed to process image: ${err.message || 'Unknown upload error'}`,
      width,
      height,
    };
  }
};
