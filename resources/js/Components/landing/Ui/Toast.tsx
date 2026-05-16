import React, { useEffect } from 'react';
import { SparklesIcon, XIcon } from '../Icons/Icons';

interface Props {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] toast-enter">
      <div className="bg-ink text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium">
        <SparklesIcon className="w-4 h-4 text-brand-light flex-shrink-0" />
        <span>{message}</span>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors ml-2">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};