import React, { useState, useEffect } from 'react';
import { Download, X, Check, AlertCircle, Pencil, RefreshCw } from 'lucide-react';

export interface ImageItemState {
    id: string;
    file: File;
    status: 'pending' | 'converting' | 'done' | 'error';
    convertedBlob?: Blob;
    originalPreview: string;
    outputName: string;
}

interface ImageItemProps {
    item: ImageItemState;
    onRemove: (id: string) => void;
    onDownload: (item: ImageItemState) => void;
    onRename: (id: string, newName: string) => void;
    onConvertSingle?: (id: string) => void;
}

export const ImageItem: React.FC<ImageItemProps> = ({ item, onRemove, onDownload, onRename, onConvertSingle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.outputName);

    useEffect(() => {
        setEditName(item.outputName);
    }, [item.outputName]);

    const handleSaveRename = () => {
        if (editName.trim()) {
            onRename(item.id, editName.trim());
        } else {
            setEditName(item.outputName); // Revert if empty
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveRename();
        } else if (e.key === 'Escape') {
            setEditName(item.outputName);
            setIsEditing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStats = () => {
        if (item.status === 'done' && item.convertedBlob) {
            const original = item.file.size;
            const converted = item.convertedBlob.size;
            const saving = ((original - converted) / original) * 100;
            return (
                <div className="flex gap-2 items-center text-xs mt-1">
                    <span className="text-slate-500 line-through">{formatSize(original)}</span>
                    <span className="text-emerald-600 font-bold">{formatSize(converted)}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">
                        {saving > 0 ? '-' : ''}{Math.abs(saving).toFixed(1)}%
                    </span>
                </div>
            );
        }
        return <div className="text-xs text-slate-500 mt-1">{formatSize(item.file.size)}</div>;
    };

    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-all hover:shadow-md">

            {/* Thumbnail */}
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <img
                    src={item.originalPreview}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                />
                {item.status === 'converting' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-1 w-full max-w-[200px]">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-full text-sm px-2 py-1 border border-blue-500 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                            />
                        </div>
                    ) : (
                        <h4
                            className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-2 cursor-pointer hover:text-blue-600 flex items-center gap-1"
                            title="Click to rename"
                            onClick={() => setIsEditing(true)}
                        >
                            {item.outputName}
                            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                        </h4>
                    )}
                </div>

                {getStats()}

                {/* Status Indicator inside metadata for mobile compactness */}
                <div className="mt-1 flex items-center gap-1.5">
                    {item.status === 'error' && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error</span>}
                    {item.status === 'done' && <span className="text-xs text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Ready</span>}
                    {item.status === 'pending' && <span className="text-xs text-slate-400">Waiting...</span>}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    title="Remove"
                >
                    <X className="w-4 h-4" />
                </button>
                {item.status === 'done' && onConvertSingle && (
                    <button
                        onClick={() => onConvertSingle(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                        title="Re-convert"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
                {item.status === 'done' && (
                    <button
                        onClick={() => onDownload(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};
