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
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-5 mb-8 sticky top-6 z-20 w-full transition-all">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                {/* Quality Controls */}
                <div className="flex flex-col gap-3 w-full md:w-1/3">
                    <div className="flex justify-between text-sm items-center">
                        <span className="flex items-center gap-2 font-semibold text-slate-300">
                            <Settings2 className="w-4 h-4 text-slate-400" />
                            Quality
                        </span>
                        <span className="bg-slate-800 px-2.5 py-0.5 rounded-md text-blue-400 font-bold border border-slate-700">
                            {Math.round(quality * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        disabled={isConverting}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={onClear}
                        disabled={!hasFiles || isConverting}
                        className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Clear all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onConvert}
                        disabled={!hasFiles || isConverting}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 hover:shadow-lg transition-all border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isConverting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
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
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download className="w-5 h-5" />
                            Download ZIP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
