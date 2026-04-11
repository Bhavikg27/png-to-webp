import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface UploadAreaProps {
    onFilesAdded: (files: File[]) => void;
    className?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesAdded, className }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFilesAdded(acceptedFiles);
        }
    }, [onFilesAdded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/svg+xml': ['.svg'],
        },
        multiple: true
    });

    return (
        <div {...getRootProps()}>
            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={twMerge(
                clsx(
                    "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                    "hover:border-blue-500 hover:bg-blue-900/20 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
                    isDragActive
                        ? "border-blue-500 bg-blue-900/30 scale-[1.02] shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]"
                        : "border-slate-700 bg-slate-900/50"
                ),
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="bg-blue-600/10 p-4 rounded-full mb-5 border border-blue-500/20 shadow-inner">
                <UploadCloud className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
                {isDragActive ? "Drop images here..." : "Click or drag images to upload"}
            </h3>
                <p className="text-slate-400 max-w-sm">
                    Supports PNG, JPG, and JPEG files.
                </p>
            </motion.div>
        </div>
    );
};
