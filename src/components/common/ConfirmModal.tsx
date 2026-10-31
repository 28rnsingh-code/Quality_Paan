import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className={`relative w-full max-w-md bg-[#121212] rounded-2xl p-6 shadow-2xl space-y-4 text-center border ${
          isDanger 
            ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
            : isWarning 
            ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
            : 'border-[#C59B27]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div 
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
            isDanger 
              ? 'bg-red-950/80 border border-red-500/60 text-red-400' 
              : isWarning 
              ? 'bg-amber-950/80 border border-amber-500/60 text-amber-400' 
              : 'bg-[#201A0B] border border-[#D4AF37]/60 text-[#D4AF37]'
          }`}
        >
          {isDanger ? <Trash2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
        </div>

        <div className="space-y-2">
          <h3 className="font-royal text-lg font-bold text-gray-100">{title}</h3>
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#252525]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#222] text-gray-300 hover:text-white font-medium text-xs transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2.5 rounded-xl font-royal font-bold text-xs shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer ${
              isDanger 
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white' 
                : isWarning 
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black' 
                : 'bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] text-black'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
