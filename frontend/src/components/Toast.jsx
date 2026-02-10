import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        return { showToast: () => console.warn('Toast provider not found') };
    }
    return ctx;
};

const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

const Toast = ({ toast, onRemove }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 3500);
        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    return (
        <div className={`ff-toast ff-toast--${toast.type} ${exiting ? 'ff-toast--exit' : ''}`}>
            <span className="ff-toast__icon">{ICONS[toast.type] || ICONS.info}</span>
            <span className="ff-toast__msg">{toast.message}</span>
            <button className="ff-toast__close" onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }}>×</button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="ff-toast-container">
                {toasts.map(t => <Toast key={t.id} toast={t} onRemove={removeToast} />)}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
