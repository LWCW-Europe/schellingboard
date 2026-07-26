"use client";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Toast = { id: number; message: string };

const ToastContext = createContext<(message: string) => void>(() => {});

/**
 * Toasts survive client-side navigation because the provider lives in the site
 * layout: a page can show one and immediately `router.push` elsewhere. They
 * never expire on their own — the message is long enough that a timeout would
 * cut readers off, so dismissal is always the reader's choice.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // A counter, not Date.now(): two toasts raised in the same millisecond would
  // share an id, and dismissing either would remove both.
  const nextId = useRef(0);
  const showToast = useCallback((message: string) => {
    setToasts((current) => [...current, { id: nextId.current++, message }]);
  }, []);
  const dismiss = (id: number) =>
    setToasts((current) => current.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg"
          >
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded p-1 hover:bg-white/20 active:bg-white/30"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (message: string) => void {
  return useContext(ToastContext);
}
