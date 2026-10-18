/**
 * High-performance client-side image compression and resizing utility.
 * - Scales large multi-megabyte images down to a maximum dimension (default: 2000px).
 * - Preserves extreme sharpness on Retina / 4K displays.
 * - Converts to optimized WebP format with high quality (0.85).
 * - Drastically reduces file size (e.g. 8MB -> ~180KB) so cloud uploads are lightning fast.
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 2000,
    maxHeight = 2000,
    quality = 0.85,
    outputType = 'image/webp'
  } = options;

  // SVGs and small icons do not need raster compression
  if (file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Invalid or corrupted image file.'));

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale factor
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const scale = Math.min(widthRatio, heightRatio);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable.'));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed.'));
              return;
            }

            // Create a clean filename with .webp extension
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const newFilename = `${originalName}.webp`;

            const compressedFile = new File([blob], newFilename, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable string (e.g. "1.4 MB")
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
