import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, RefreshCw, X, Link, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories' | 'hero' | 'plans' | 'general';
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  helperText,
  aspectRatio = 'square',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processAndUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      // POST to server disk endpoint /api/upload to save physical file on server
      let finalUrl = base64Data;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name,
            folder: folder || 'products',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.url) {
            finalUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server disk upload fallback to data URL:', uploadErr);
      }

      // Save clean server URL (or fallback) into component state & localStorage
      onChange(finalUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err?.message || 'Error processing image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'banner':
        return 'aspect-[21/9] max-h-48';
      case 'video':
        return 'aspect-video max-h-48';
      case 'square':
      default:
        return 'aspect-square max-h-44';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL field' : 'Or enter custom URL'}</span>
        </button>
      </div>

      {helperText && <p className="text-[11px] text-gray-400">{helperText}</p>}

      {/* Main Drag-and-Drop & Live Preview Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-3 flex flex-col sm:flex-row items-center gap-4 bg-[#110E07] ${
          isDragging
            ? 'border-[#D4AF37] bg-[#221A08]'
            : value
            ? 'border-[#D4AF37]/40 hover:border-[#D4AF37]'
            : 'border-[#333] hover:border-[#D4AF37]/50'
        }`}
      >
        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Left: Image Thumbnail Preview (if image exists) */}
        {value ? (
          <div className="relative group flex-shrink-0">
            <div className={`w-32 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/40 shadow ${getAspectClass()}`}>
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-transform hover:scale-110"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-[#1A1A1A] border border-[#333] flex flex-col items-center justify-center text-gray-500 flex-shrink-0">
            <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
            <span className="text-[10px]">No image</span>
          </div>
        )}

        {/* Right: Upload Actions & Feedback */}
        <div className="flex-1 space-y-2 text-center sm:text-left w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading &amp; Saving...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-black" />
                  <span>{value ? 'Replace Image' : 'Upload Image File'}</span>
                </>
              )}
            </button>

            {value && (
              <span className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]" title={value}>
                {value.startsWith('/uploads') ? value : value.startsWith('data:') ? 'Local file uploaded' : value}
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-400">
            {isDragging
              ? 'Drop image file here...'
              : 'Drag & drop image here or click to choose from computer / mobile.'}
          </p>

          {/* Success Status Notice */}
          {uploadSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-[#2ECC71] font-semibold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image uploaded &amp; saved to /uploads/{folder}!</span>
            </div>
          )}

          {/* Error Notice */}
          {uploadError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Optional Manual URL Input (for external links or overrides) */}
      {showUrlInput && (
        <div className="p-2.5 rounded-xl bg-[#161616] border border-[#333] space-y-1 animate-in fade-in">
          <label className="text-[10px] text-gray-400 font-semibold uppercase">
            Direct Image URL or Path:
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="w-full bg-[#111] text-white text-xs px-3 py-2 rounded-lg border border-[#444] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      )}
    </div>
  );
};
