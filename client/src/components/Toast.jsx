import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = { success: '🎉', error: '😅', info: '⭐' };
  const bg = { success: 'bg-gradient-to-r from-green-500 to-emerald-500', error: 'bg-gradient-to-r from-red-500 to-rose-500', info: 'bg-gradient-to-r from-purple-600 to-indigo-600' };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`${bg[t.type] || bg.info} text-white px-5 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3 animate-bounce-in`}
          >
            <span className="text-xl">{icons[t.type] || icons.info}</span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-lg leading-none ml-2">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
