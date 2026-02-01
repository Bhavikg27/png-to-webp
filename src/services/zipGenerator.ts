import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ImageFile {
    name: string;
    blob: Blob;
}

/**
 * Zips multiple images and triggers a download.
 * @param images - Array of images (name and blob) to zip.
 * @param filename - Name of the downloaded zip file.
 */
export async function downloadZip(images: ImageFile[], filename: string = 'images.zip') {
    const zip = new JSZip();

    images.forEach((img) => {
        zip.file(img.name, img.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
}
