'use client';

import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';

interface DownloadPdfButtonProps {
  onDownload: () => void | Promise<void>;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({
  onDownload,
  label = 'Download PDF',
  className = '',
  variant = 'secondary',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsGenerating(true);
      await Promise.resolve(onDownload());
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  let baseStyle = 'inline-flex items-center gap-1.5 font-bold rounded-xl transition-all cursor-pointer text-xs';

  if (variant === 'primary') {
    baseStyle += ' bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 shadow-xs';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-700 px-3.5 py-2';
  } else if (variant === 'outline') {
    baseStyle += ' bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 px-3.5 py-2';
  } else if (variant === 'compact') {
    baseStyle += ' bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 text-[11px]';
  }

  return (
    <button onClick={handleClick} disabled={isGenerating} className={`${baseStyle} ${className}`}>
      {isGenerating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
      ) : isSuccess ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
      )}
      <span>{isGenerating ? 'Generating...' : isSuccess ? 'PDF Downloaded' : label}</span>
    </button>
  );
};
