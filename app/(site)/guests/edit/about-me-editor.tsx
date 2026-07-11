"use client";

import "client-only";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import clsx from "clsx";
import "@mdxeditor/editor/style.css";

export default function AboutMeEditor(props: {
  value: string;
  onChange: (markdown: string) => void;
  onBlur?: () => void;
  onError?: (err: { type: string; message: string }) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const { value, onBlur, onChange, onError, invalid, placeholder } = props;
  return (
    <MDXEditor
      contentEditableClassName="prose prose-neutral max-w-none"
      markdown={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      onError={(err) =>
        onError?.({
          type: err.source,
          message: err.error,
        })
      }
      placeholder={placeholder}
      className={clsx(
        "rounded-md text-sm resize-y overflow-y-auto h-40 border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none",
        invalid ? "invalid" : ""
      )}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
        headingsPlugin({ allowedHeadingLevels: [4, 5, 6] }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
      ]}
    />
  );
}
