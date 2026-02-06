import { useState, useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimes, FaHeart, FaCompass } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Toast Notification Component - Professional notifications for user actions
 */
export default function Toast({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose,
  title = null,
  action = null
}) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: FaCheckCircle,
        bgColor: theme === 'dark' ? 'bg-green-800' : 'bg-green-50',
        borderColor: 'border-green-500',
        iconColor: 'text-green-500',
        textColor: theme === 'dark' ? 'text-green-100' : 'text-green-800'
      },
      info: {
        icon: FaInfoCircle,
        bgColor: theme === 'dark' ? 'bg-blue-800' : 'bg-blue-50',
        borderColor: 'border-blue-500',
        iconColor: 'text-blue-500',
        textColor: theme === 'dark' ? 'text-blue-100' : 'text-blue-800'
      },
      warning: {
        icon: FaExclamationTriangle,
        bgColor: theme === 'dark' ? 'bg-yellow-800' : 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        iconColor: 'text-yellow-500',
        textColor: theme === 'dark' ? 'text-yellow-100' : 'text-yellow-800'
      },
      wishlist: {
        icon: FaHeart,
        bgColor: theme === 'dark' ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-50 to-pink-50',
        borderColor: 'border-purple-500',
        iconColor: 'text-purple-500',
        textColor: theme === 'dark' ? 'text-purple-100' : 'text-purple-800'
      }
    };

    return configs[type] || configs.info;
  };

  if (!isVisible) return null;

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div className={`
      relative max-w-md w-full
      transform transition-all duration-300 ease-in-out
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
    `}>
      <div className={`
        ${config.bgColor} ${config.textColor} 
        border-l-4 ${config.borderColor}
        rounded-lg shadow-2xl backdrop-blur-sm
        p-4 relative overflow-hidden
        border border-gray-200 dark:border-gray-700
      `}>
        {/* Background Pattern for Wishlist */}
        {type === 'wishlist' && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2">
              <FaCompass className="text-4xl text-purple-500" />
            </div>
            <div className="absolute bottom-2 left-2">
              <FaHeart className="text-2xl text-pink-500" />
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 relative z-10">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent className="text-xl" />
          </div>

          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-lg mb-1">
                {title}
              </h4>
            )}
            
            <p className="text-sm leading-relaxed">
              {message}
            </p>

            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${type === 'wishlist' 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-full transition-colors
              ${theme === 'dark' 
                ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <div 
            className={`h-full ${config.borderColor.replace('border-', 'bg-')} transition-all ease-linear`}
            style={{
              width: '100%',
              animation: `shrinkWidth ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Toast Container Component - Manages multiple toasts
 */
export function ToastContainer() {
  return (
    <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2">
      {/* Toasts will be rendered here */}
    </div>
  );
}

/**
 * Toast Service - Programmatic toast management
 */
class ToastService {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  show(options) {
    const toast = {
      id: Date.now() + Math.random(),
      ...options,
      timestamp: Date.now()
    };

    this.toasts.push(toast);
    this.notifyListeners();

    return toast.id;
  }

  success(title, message, options = {}) {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  info(title, message, options = {}) {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  warning(title, message, options = {}) {
    return this.show({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  wishlist(title, message, options = {}) {
    return this.show({
      type: 'wishlist',
      title,
      message,
      duration: 5000,
      ...options
    });
  }

  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  clear() {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  getToasts() {
    return this.toasts;
  }
}

export const toastService = new ToastService();