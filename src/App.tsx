import { useState } from 'react'
import { UploadArea } from './components/UploadArea'
import { ControlPanel } from './components/ControlPanel'
import { ImageItem, type ImageItemState } from './components/ImageItem'
import { convertImageToWebP } from './services/imageConverter'
import { downloadZip } from './services/zipGenerator'
import { Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

  const handleConvertSingle = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setIsConverting(true);
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'converting' } : i));

    try {
      const blob = await convertImageToWebP(item.file, quality);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'done', convertedBlob: blob } : i));
    } catch (error) {
      console.error(error);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'error' } : i));
    } finally {
      setIsConverting(false);
    }
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
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-4 md:p-8 font-sans text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-12 mt-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-6 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
          >
            <ImageIcon className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 mb-4"
          >
            Image to WebP Converter
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Convert PNG and JPG images to optimized WebP format instantly in your browser. Fast, secure, and offline.
          </motion.p>
        </header>

        {/* Main Content */}
        <main>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <UploadArea onFilesAdded={handleFilesAdded} className="min-h-[300px]" />
            </motion.div>
          ) : (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

              <motion.div layout className="flex flex-col gap-3">
                <AnimatePresence>
                  {items.map(item => (
                    <ImageItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onDownload={handleDownload}
                      onRename={handleRename}
                      onConvertSingle={handleConvertSingle}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div layout className="mt-8">
                <UploadArea onFilesAdded={handleFilesAdded} className="py-8 border-dashed border-2 opacity-70 hover:opacity-100" />
              </motion.div>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 pb-8 text-center text-slate-500 text-sm">
          <p>Privacy friendly &bull; No files uploaded to server &bull; Runs offline</p>
        </footer>

      </div>
    </div>
  )
}

export default App
