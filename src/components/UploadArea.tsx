import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
        },
        multiple: true
    });

    return (
        <div
            {...getRootProps()}
            className={twMerge(
                clsx(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ease-in-out",
                    "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
                    isDragActive ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]" : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                ),
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {isDragActive ? "Drop images here" : "Click or drag images to upload"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Supports PNG, JPG, and JPEG files.
            </p>
        </div>
    );
};
