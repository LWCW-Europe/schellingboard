"use client";

import {
  forwardRef,
  KeyboardEventHandler,
  TextareaHTMLAttributes,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Markdown } from "@/app/(site)/markdown";
import {
  isKey,
  applyToTextarea,
  options,
} from "@/app/components/markdown-options";

const TAB_STYLE =
  "first:rounded-tl-md border-e-1 border-gray-400 p-2 hover:bg-gray-300 cursor-pointer";

/**
 * A textarea with a Markdown toolbar and a preview tab.
 *
 * The editor frame (border, shadow, focus ring, rounding) belongs to the
 * component: style it with `wrapperClassName`, not `className`. `className`
 * reaches the textarea itself, so it must not repeat that chrome — a border
 * there would draw a second one inside the frame.
 */
export const MarkdownTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    wrapperClassName?: string;
  }
>(function MarkdownTextarea({ wrapperClassName, ...props }, ref) {
  // Snapshot of the text taken when Preview is opened, `null` while editing.
  // Reading the textarea at that moment covers callers that leave the value
  // uncontrolled (react-hook-form's `register`) as well as controlled ones,
  // and the textarea can't change while it's hidden behind the preview.
  const [preview, setPreview] = useState<string | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const setTextareaRefs = (el: HTMLTextAreaElement | null) => {
    textarea.current = el;

    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const option = options.find((opt) => isKey(opt.key)(e));
    if (option && textarea.current) {
      e.preventDefault();
      applyToTextarea(option.template, textarea.current);
    }
  };

  return (
    <div
      className={clsx(
        wrapperClassName,
        "flex flex-col shadow-sm rounded-md focus-within:outline-none border border-gray-300 focus-within:ring-2 focus-within:ring-rose-400 focus-within:outline-0 focus-within:border-rose-400"
      )}
    >
      <div className="flex flex-row rounded-md rounded-b-none border-b border-gray-400 bg-gray-200 text-sm items-center">
        <button
          type="button"
          className={clsx(TAB_STYLE, preview === null && "bg-gray-300")}
          onClick={() => setPreview(null)}
        >
          Edit
        </button>
        <button
          type="button"
          className={clsx(TAB_STYLE, preview !== null && "bg-gray-300")}
          onClick={() => setPreview(textarea.current?.value ?? "")}
        >
          Preview
        </button>
        <span className="flex-1 flex flex-row justify-end overflow-x-visible overflow-y-hidden">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              className="last:m-1 my-1 p-1 h-fit cursor-pointer active:border-rose-400 border-solid border border-transparent hover:bg-gray-300 rounded-md"
              onClick={() => {
                if (textarea.current) {
                  applyToTextarea(option.template, textarea.current);
                }
              }}
              title={option.label}
            >
              <option.icon className="block h-4 w-4 stroke-2" />
            </button>
          ))}
        </span>
      </div>
      {/* Kept mounted while previewing: unmounting would lose the text of an
          uncontrolled textarea, and the caret position of a controlled one. */}
      <textarea
        {
          ...props /* Don't manage the value prop - let the user do it if they like */
        }
        ref={setTextareaRefs}
        onKeyDown={onKeyDown}
        className={clsx(
          "w-full font-(family-name:--font-mono) rounded-t-none rounded-md text-sm resize-y h-40 border-none ring-0 outline-0 bg-white px-4 py-2 placeholder-gray-400 transition-colors",
          props.className,
          preview !== null && "hidden"
        )}
      />
      <div
        className={clsx(
          "w-full h-40 px-4 py-2 text-sm rounded-t-none border-none rounded-md overflow-y-auto overflow-x-hidden",
          preview === null && "hidden"
        )}
      >
        <Markdown>{preview}</Markdown>
      </div>
    </div>
  );
});
