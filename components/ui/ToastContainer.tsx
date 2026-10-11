import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderStyles = {
          success: 'border-[#20D997]/40 bg-[#101927]',
          error: 'border-[#FF5C72]/40 bg-[#101927]',
          warning: 'border-[#F5B942]/40 bg-[#101927]',
          info: 'border-[#28D7E5]/40 bg-[#101927]',
        };

        const iconStyles = {
          success: <CheckCircle2 className="w-5 h-5 text-[#20D997] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#FF5C72] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#F5B942] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#28D7E5] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              borderStyles[toast.type]
            }`}
          >
            {iconStyles[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#F1F5FB]">{toast.title}</h4>
              <p className="text-xs text-[#9AA8BB] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#6E7D92] hover:text-[#F1F5FB] transition-colors p-1 -mr-1 -mt-1 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
