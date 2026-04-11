import React, { useState } from 'react';
import { Download, X, Check, AlertCircle, Pencil, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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

    // Update local state when prop changes, except when editing
    if (item.outputName !== editName && !isEditing) {
        setEditName(item.outputName);
    }

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
                <div className="flex gap-3 items-center text-sm mt-1.5">
                    <span className="text-slate-500 line-through">{formatSize(original)}</span>
                    <span className="text-slate-300 font-semibold">{formatSize(converted)}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-xs font-semibold shadow-sm">
                        {saving > 0 ? '-' : ''}{Math.abs(saving).toFixed(1)}%
                    </span>
                </div>
            );
        }
        return <div className="text-sm text-slate-500 mt-1.5">{formatSize(item.file.size)}</div>;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-slate-900/60 hover:bg-slate-900/80 rounded-xl p-4 shadow-sm border border-slate-800 hover:border-slate-700 flex items-center gap-5 transition-all duration-200"
        >

            {/* Thumbnail */}
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shadow-inner">
                <img
                    src={item.originalPreview}
                    alt={item.file.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                {item.status === 'converting' && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-1 w-full max-w-[250px]">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-full text-sm px-2.5 py-1.5 border border-blue-500 rounded-md bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                            />
                        </div>
                    ) : (
                        <h4
                            className="text-base font-semibold text-slate-200 truncate pr-2 cursor-pointer hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                            title="Click to rename"
                            onClick={() => setIsEditing(true)}
                        >
                            {item.outputName}
                            <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-blue-400" />
                        </h4>
                    )}
                </div>

                {getStats()}

                {/* Status Indicator */}
                <div className="mt-1.5 flex items-center gap-1.5">
                    {item.status === 'error' && <span className="text-xs font-medium text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Error</span>}
                    {item.status === 'done' && <span className="text-xs font-medium text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Ready</span>}
                    {item.status === 'pending' && <span className="text-xs font-medium text-slate-500 flex items-center gap-1">Waiting...</span>}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
                {item.status === 'done' && (
                    <button
                        onClick={() => onDownload(item)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                )}
                {item.status === 'done' && onConvertSingle && (
                    <button
                        onClick={() => onConvertSingle(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        title="Re-convert"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
