'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
}

export default function FileUpload({ onUpload, loading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(selectedFile.type)) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {!previewUrl ? (
        <div
          className={cn(
            'relative group cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center',
            dragActive 
              ? 'border-gold bg-gold/5' 
              : 'border-white/10 hover:border-gold/50 bg-dark-200 hover:bg-dark-100'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-gold transition-colors" />
          </div>
          <p className="text-lg font-medium text-white mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-zinc-500">SVG, PNG, JPG or WebP (max. 5MB)</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gold" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                  {file?.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {(file!.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-zinc-400 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-6">
            <Image
              src={previewUrl}
              alt="Payment proof preview"
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-gold py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit Payment Proof'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
