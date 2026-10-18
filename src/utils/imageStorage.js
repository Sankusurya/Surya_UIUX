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

/**
 * Automatically divides an ultra-tall image into seamless horizontal slices (~2,000 to ~2,500px each)
 * at 100% full original quality (no compression or downsampling).
 * This prevents mobile browsers (especially Safari on iPhones) from automatically downsampling
 * tall images into blurry textures due to hardware memory limits.
 *
 * @param {File} file - User uploaded image file
 * @param {number} maxSliceHeight - Max height per slice (default 2400px)
 * @returns {Promise<{ width: number, height: number, isSliced: boolean, slices: Array<{ file: File, width: number, height: number, index: number }> }>}
 */
export const sliceImageFile = async (file, maxSliceHeight = 2400) => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth || 1;
      const height = img.naturalHeight || 1;

      // If the image is not ultra-tall (e.g. <= 2800px), keep it as a single piece
      if (height <= 2800) {
        resolve({
          width,
          height,
          isSliced: false,
          slices: [
            {
              file,
              width,
              height,
              index: 0,
            },
          ],
        });
        return;
      }

      try {
        const numSlices = Math.ceil(height / maxSliceHeight);
        const slices = [];
        const mimeType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
        const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png';
        const baseName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'case-study';

        for (let i = 0; i < numSlices; i++) {
          const startY = i * maxSliceHeight;
          const currentSliceHeight = Math.min(maxSliceHeight, height - startY);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = currentSliceHeight;
          const ctx = canvas.getContext('2d');

          // Draw slice at exact 1:1 original quality
          ctx.drawImage(
            img,
            0,
            startY,
            width,
            currentSliceHeight,
            0,
            0,
            width,
            currentSliceHeight
          );

          // Convert slice to lossless blob
          const blob = await new Promise((resBlob) => {
            canvas.toBlob(resBlob, mimeType, 1.0);
          });

          const sliceFile = new File(
            [blob],
            `${baseName}-slice-${i + 1}.${ext}`,
            { type: mimeType }
          );

          slices.push({
            file: sliceFile,
            width,
            height: currentSliceHeight,
            index: i,
          });
        }

        resolve({
          width,
          height,
          isSliced: true,
          slices,
        });
      } catch (sliceErr) {
        // Fallback to single piece if canvas slicing fails
        resolve({
          width,
          height,
          isSliced: false,
          slices: [{ file, width, height, index: 0 }],
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: 0,
        height: 0,
        isSliced: false,
        slices: [{ file, width: 0, height: 0, index: 0 }],
      });
    };

    img.src = objectUrl;
  });
};

/**
 * High-level processor for case study deliverables:
 * 1. Uploads the full original file (for original backup and full-resolution reference)
 * 2. If image is ultra-tall (> 2800px), automatically slices into seamless pieces behind the scenes
 *    and uploads each piece so mobile browsers display it at 100% pin-sharp quality.
 *
 * @param {File} file
 * @param {Function} [onProgress] - Optional progress callback ({ step, current, total, name })
 * @returns {Promise<{ success: boolean, url: string, originalUrl: string, width: number, height: number, fileSize: number, slices: Array<{ url: string, width: number, height: number, index: number }>, isSliced: boolean, sizeInfo: string, error?: string }>}
 */
export const processCaseStudyImage = async (file, onProgress) => {
  if (!file) {
    return { success: false, error: 'No image file provided.' };
  }

  try {
    if (onProgress) onProgress({ step: 'Analyzing dimensions', current: 0, total: 100 });

    // Step 1: Slice if ultra-tall
    const sliceResult = await sliceImageFile(file, 2400);
    const { width, height, isSliced, slices } = sliceResult;

    if (onProgress) onProgress({ step: 'Uploading master visual', current: 20, total: 100 });

    // Step 2: Upload full original image
    const masterUpload = await uploadImageToStorage(file, 'casestudies');
    if (!masterUpload.success) {
      return {
        success: false,
        error: masterUpload.error || 'Failed to upload image.',
        width,
        height,
      };
    }

    // Step 3: Upload slices (or use master URL if not sliced)
    const uploadedSlices = [];

    if (isSliced && slices.length > 1) {
      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        if (onProgress) {
          onProgress({
            step: `Uploading seamless slice ${i + 1} of ${slices.length}`,
            current: 30 + Math.round(((i + 1) / slices.length) * 65),
            total: 100,
          });
        }

        const sliceUpload = await uploadImageToStorage(slice.file, 'casestudies/slices');
        if (sliceUpload.success) {
          uploadedSlices.push({
            url: sliceUpload.url,
            width: slice.width,
            height: slice.height,
            index: i,
          });
        } else {
          // If a slice upload fails, fall back to master URL for that slice
          uploadedSlices.push({
            url: masterUpload.url,
            width: slice.width,
            height: slice.height,
            index: i,
          });
        }
      }
    } else {
      // Single piece
      uploadedSlices.push({
        url: masterUpload.url,
        width,
        height,
        index: 0,
      });
    }

    const sizeInfo = isSliced
      ? `${formatBytes(file.size)} · Divided into ${uploadedSlices.length} seamless pieces (mobile retina sharp)`
      : `${formatBytes(file.size)} · Full Resolution`;

    return {
      success: true,
      url: masterUpload.url,
      originalUrl: masterUpload.url,
      width,
      height,
      fileSize: file.size,
      slices: uploadedSlices,
      isSliced,
      sizeInfo,
    };
  } catch (err) {
    return {
      success: false,
      error: `Error processing case study visual: ${err.message || 'Unknown error'}`,
    };
  }
};

