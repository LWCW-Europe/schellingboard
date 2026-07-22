"use client";

import {
  forwardRef,
  KeyboardEventHandler,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Markdown } from "@/app/(site)/markdown";
import { isKey, options } from "@/app/components/markdown-options";

const TAB_STYLE =
  "first:rounded-tl-md border-e-1 border-gray-400 p-2 hover:bg-gray-300 cursor-pointer";

export const MarkdownTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    wrapperClassName?: string;
  }
>(function MarkdownTextarea({ wrapperClassName, ...props }, ref) {
  const [value, setValue] = useState(props.value);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const setTextareaRefs = (el: HTMLTextAreaElement | null) => {
    textarea.current = el;

    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const option = options.find((opt) => isKey(opt.key)(e));
    if (option) {
      e.preventDefault();
      option.onClick(e.currentTarget);
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
          className={clsx(TAB_STYLE, mode === "edit" && "bg-gray-300")}
          onClick={() => setMode("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          className={clsx(TAB_STYLE, mode === "preview" && "bg-gray-300")}
          onClick={() => {
            if (textarea.current) {
              setValue(textarea.current.value);
            }
            setMode("preview");
          }}
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
                  option.onClick(textarea.current);
                }
              }}
              title={option.label}
            >
              <option.icon className="block h-4 w-4 stroke-2" />
            </button>
          ))}
        </span>
      </div>
      {/* Refrain from redrawing the textarea - that resets the text inside */}
      <textarea
        {
          ...props /* Don't manage the value prop - let the user do it if they like */
        }
        ref={setTextareaRefs}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={clsx(
          props.className,
          "w-full font-(family-name:--font-mono) rounded-t-none rounded-md text-sm resize-y peer h-40 border-none ring-0 outline-0 bg-white px-4 py-2 placeholder-gray-400 transition-colors",
          mode === "preview" && "hidden"
        )}
      />
      <div
        className={clsx(
          props.className,
          "w-full h-40 px-4 py-2 text-sm rounded-t-none border-none rounded-md resize-y overflow-y-auto overflow-x-hidden",
          mode === "edit" && "hidden"
        )}
      >
        <Markdown>{value == null ? null : String(value)}</Markdown>
      </div>
    </div>
  );
});
