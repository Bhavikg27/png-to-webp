import React from 'react';
import { Download, RefreshCw, Trash2, Settings2 } from 'lucide-react';

interface ControlPanelProps {
    quality: number;
    setQuality: (q: number) => void;
    onConvert: () => void;
    onDownloadAll: () => void;
    onClear: () => void;
    isConverting: boolean;
    hasConverted: boolean;
    hasFiles: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    quality,
    setQuality,
    onConvert,
    onDownloadAll,
    onClear,
    isConverting,
    hasConverted,
    hasFiles,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6 sticky top-4 z-10 w-full">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                {/* Quality Controls */}
                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                            <Settings2 className="w-4 h-4" />
                            Quality
                        </span>
                        <span className="text-blue-600 font-bold">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                        disabled={isConverting}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={onClear}
                        disabled={!hasFiles || isConverting}
                        className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Clear all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onConvert}
                        disabled={!hasFiles || isConverting}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isConverting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Converting...
                            </>
                        ) : hasConverted ? (
                            'Re-convert All'
                        ) : (
                            'Convert Images'
                        )}
                    </button>

                    {hasConverted && (
                        <button
                            onClick={onDownloadAll}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download ZIP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
