"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal(props: {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  hideClose?: boolean;
  zIndex?: string;
  portal?: boolean; // Explicitly control portaling behavior
}) {
  const {
    open,
    setOpen,
    children,
    hideClose,
    zIndex = "z-10",
    portal = false,
  } = props;
  const fakeRef = useRef(null);

  const modalContent = (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          initialFocus={fakeRef}
          className={`fixed inset-0 ${zIndex} overflow-y-auto`}
          onClose={() => setOpen(false)}
        >
          <button ref={fakeRef} className="hidden" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-overlay transition-opacity" />
          </Transition.Child>
          <div className={`fixed inset-0 ${zIndex} w-full overflow-y-auto`}>
            <div className="flex min-h-full w-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative mb-10 transform overflow-visible rounded-lg bg-surface-raised px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  {children}
                  {!hideClose && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-on-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );

  // If explicitly requested to portal (for nested modals), use a separate container
  if (portal && typeof document !== "undefined") {
    // Create or get a high-priority modal root
    let highPriorityModalRoot = document.getElementById(
      "high-priority-modal-root"
    );
    if (!highPriorityModalRoot) {
      highPriorityModalRoot = document.createElement("div");
      highPriorityModalRoot.id = "high-priority-modal-root";
      document.body.appendChild(highPriorityModalRoot);
    }
    return createPortal(modalContent, highPriorityModalRoot);
  }

  return modalContent;
}
