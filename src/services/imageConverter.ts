
/**
 * Converts a given File (PNG/JPG) to a WebP Blob with the specified quality.
 * @param file - The original image file.
 * @param quality - Quality between 0 and 1 (e.g., 0.8 for 80%).
 * @returns Promise that resolves to the WebP Blob.
 */
export async function convertImageToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create an ImageBitmap from the file for better performance
      const bitmap = await createImageBitmap(file);
      
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the image
      ctx.drawImage(bitmap, 0, 0);
      
      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Conversion failed'));
          }
          // Cleanup
          bitmap.close();
        },
        'image/webp',
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
}
