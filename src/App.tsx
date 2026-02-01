import { useState } from 'react'
import { UploadArea } from './components/UploadArea'
import { ControlPanel } from './components/ControlPanel'
import { ImageItem, type ImageItemState } from './components/ImageItem'
import { convertImageToWebP } from './services/imageConverter'
import { downloadZip } from './services/zipGenerator'
import { Image as ImageIcon } from 'lucide-react';

function App() {
  const [items, setItems] = useState<ImageItemState[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesAdded = (files: File[]) => {
    const newItems: ImageItemState[] = files.map(file => {
      const nameParts = file.name.split('.');
      const nameWithoutExt = nameParts.slice(0, -1).join('.');

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending',
        originalPreview: URL.createObjectURL(file),
        outputName: nameWithoutExt // Default to original filename (no extension)
      };
    });
    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemove = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.originalPreview) URL.revokeObjectURL(item.originalPreview);
      if (item?.convertedBlob) URL.revokeObjectURL(URL.createObjectURL(item.convertedBlob));
      return prev.filter(i => i.id !== id);
    });
  };

  const handleRename = (id: string, newName: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, outputName: newName } : item
    ));
  };

  const handleClear = () => {
    items.forEach(item => {
      if (item.originalPreview) URL.revokeObjectURL(item.originalPreview);
    });
    setItems([]);
  };

  const handleConvert = async () => {
    setIsConverting(true);

    const convertItem = async (item: ImageItemState) => {
      if (item.status === 'done' && item.convertedBlob) return item;

      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'converting' } : i));

      try {
        const blob = await convertImageToWebP(item.file, quality);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', convertedBlob: blob } : i));
      } catch (error) {
        console.error(error);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error' } : i));
      }
    };

    await Promise.all(items.map(convertItem));
    setIsConverting(false);
  };

  const handleDownload = (item: ImageItemState) => {
    if (item.convertedBlob) {
      const url = URL.createObjectURL(item.convertedBlob);
      const a = document.createElement('a');
      a.href = url;
      // Append .webp if user didn't type it
      let filename = item.outputName;
      if (!filename.toLowerCase().endsWith('.webp')) {
        filename += '.webp';
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAll = async () => {
    const convertedItems = items.filter(i => i.status === 'done' && i.convertedBlob);
    if (convertedItems.length === 0) return;

    const imagesToZip = convertedItems.map(item => {
      let filename = item.outputName;
      if (!filename.toLowerCase().endsWith('.webp')) {
        filename += '.webp';
      }
      return {
        name: filename,
        blob: item.convertedBlob!
      };
    });

    await downloadZip(imagesToZip, 'converted-images.zip');
  };

  const hasConverted = items.some(i => i.status === 'done');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-3">
            Image to WebP Converter
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Convert your images to WebP format instantly in your browser.
          </p>
        </header>

        {/* Main Content */}
        <main>
          {items.length === 0 ? (
            <UploadArea onFilesAdded={handleFilesAdded} className="min-h-[300px]" />
          ) : (
            <>
              <ControlPanel
                quality={quality}
                setQuality={setQuality}
                onConvert={handleConvert}
                onDownloadAll={handleDownloadAll}
                onClear={handleClear}
                isConverting={isConverting}
                hasConverted={hasConverted}
                hasFiles={items.length > 0}
              />

              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <ImageItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onDownload={handleDownload}
                    onRename={handleRename}
                  />
                ))}
              </div>

              <div className="mt-8">
                <UploadArea onFilesAdded={handleFilesAdded} className="py-8 border-dashed border-2 opacity-70 hover:opacity-100" />
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p>Privacy friendly &bull; No files uploaded to server &bull; Runs offline</p>
        </footer>

      </div>
    </div>
  )
}

export default App
