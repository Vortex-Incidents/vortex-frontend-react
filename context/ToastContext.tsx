import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              flex items-center min-w-[300px] p-4 rounded-lg shadow-lg border animate-slide-up bg-white dark:bg-dark-800
              ${toast.type === 'success' ? 'border-green-500 text-green-700 dark:text-green-400' : ''}
              ${toast.type === 'error' ? 'border-red-500 text-red-700 dark:text-red-400' : ''}
              ${toast.type === 'info' ? 'border-blue-500 text-blue-700 dark:text-blue-400' : ''}
            `}
                    >
                        <div className="mr-3">
                            {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
                            {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                            {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                        </div>
                        <p className="text-sm font-medium flex-grow text-gray-800 dark:text-white">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
