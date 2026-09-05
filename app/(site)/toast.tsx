"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ToastOptions = { autoDismissMs?: number };
type ShowToast = (message: string, options?: ToastOptions) => void;
type Toast = { id: number; message: string; autoDismissMs?: number };

const ToastContext = createContext<ShowToast>(() => {});

/**
 * Toasts survive client-side navigation because the provider lives in the site
 * layout: a page can show one and immediately `router.push` elsewhere. A
 * toast stays until dismissed unless the caller asks for `autoDismissMs`: how
 * long a message needs on screen depends on what it says, so the caller
 * decides — a passing hint a few seconds, a routine confirmation longer, a
 * message the reader must not miss forever.
 *
 * A message already on screen is never shown twice: repeating the action that
 * raised it (tapping one greyed-out button after another) replaces the copy
 * that is up rather than stacking an identical one, which also restarts its
 * countdown — otherwise a second tap could be answered by the hint vanishing.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // A counter, not Date.now(): two toasts raised in the same millisecond would
  // share an id, and dismissing either would remove both.
  const nextId = useRef(0);
  const showToast = useCallback<ShowToast>((message, options) => {
    setToasts((current) => [
      ...current.filter((toast) => toast.message !== message),
      { id: nextId.current++, message, autoDismissMs: options?.autoDismissMs },
    ]);
  }, []);
  const dismiss = useCallback(
    (id: number) =>
      setToasts((current) => current.filter((toast) => toast.id !== id)),
    []
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const { id, message, autoDismissMs } = toast;
  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = setTimeout(() => onDismiss(id), autoDismissMs);
    return () => clearTimeout(timer);
  }, [id, autoDismissMs, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg bg-bar px-4 py-3 text-bar-fg shadow-lg"
    >
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded p-1 hover:bg-bar-fg/20 active:bg-bar-fg/30"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}
