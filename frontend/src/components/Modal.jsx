import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'default' }) => {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Type styles
    const typeStyles = {
        default: 'border-slate-600',
        danger: 'border-red-500/50',
        success: 'border-emerald-500/50',
        warning: 'border-yellow-500/50',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300">
            {/* Modal Content */}
            <div
                className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 border ${typeStyles[type]} shadow-2xl transition-all duration-300 scale-100 opacity-100`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 text-slate-300">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 space-x-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
