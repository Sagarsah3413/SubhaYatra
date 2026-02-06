import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast, { toastService } from '../components/Toast';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const showToast = (options) => {
    return toastService.show(options);
  };

  const showSuccess = (title, message, options = {}) => {
    return toastService.success(title, message, options);
  };

  const showInfo = (title, message, options = {}) => {
    return toastService.info(title, message, options);
  };

  const showWarning = (title, message, options = {}) => {
    return toastService.warning(title, message, options);
  };

  const showWishlist = (title, message, options = {}) => {
    return toastService.wishlist(title, message, options);
  };

  const removeToast = (id) => {
    toastService.remove(id);
  };

  const clearToasts = () => {
    toastService.clear();
  };

  const contextValue = {
    showToast,
    showSuccess,
    showInfo,
    showWarning,
    showWishlist,
    removeToast,
    clearToasts
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Render Toasts */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}