
/**
 * Converts a given File (PNG/JPG) to a WebP Blob with the specified quality.
 * @param file - The original image file.
 * @param quality - Quality between 0 and 1 (e.g., 0.8 for 80%).
 * @returns Promise that resolves to the WebP Blob.
 */
export async function convertImageToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          URL.revokeObjectURL(url);
          return;
        }

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Conversion failed'));
            }
            // Cleanup
            URL.revokeObjectURL(url);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = (error) => {
      reject(error);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
