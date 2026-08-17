"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/app/input";
import type { SiteSettings } from "@/db/repositories/interfaces";
import { MAP_REQUIREMENTS_HINT } from "@/utils/map-image-constraints";
import { updateSettingsAction } from "../actions/admin-settings";
import { PRIMARY_BUTTON } from "./buttons";
import { MarkdownHint } from "@/app/(site)/markdown";

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [removeMap, setRemoveMap] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettingsAction(formData);
      if (!result.ok) {
        setError(result.error);
        setSaved(false);
        return;
      }
      setError(null);
      setSaved(true);
      setRemoveMap(false);
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <p role="alert" className="text-sm text-danger-fg">
          {error}
        </p>
      )}
      {saved && <p className="text-sm text-success-fg">Settings saved.</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="settings-title" className="text-sm text-fg-muted">
          Title
        </label>
        <Input
          id="settings-title"
          name="title"
          defaultValue={settings.title}
          required
          className="w-full h-10"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="settings-description" className="text-sm text-fg-muted">
          Description
        </label>
        <textarea
          id="settings-description"
          name="description"
          defaultValue={settings.description}
          rows={3}
          className="rounded-md border border-line bg-surface-raised px-4 py-2 shadow-sm focus:ring-2 focus:ring-brand-accent focus:outline-0 focus:border-none"
        />
        <MarkdownHint />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="settings-map" className="text-sm text-fg-muted">
          Map
        </label>
        {settings.mapImageUrl && !removeMap && (
          <Image
            src={settings.mapImageUrl}
            alt="Current map"
            width={240}
            height={180}
            className="rounded border border-line-subtle"
          />
        )}
        <input
          id="settings-map"
          ref={fileRef}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={removeMap}
          className="text-sm text-fg-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-fg-muted hover:file:bg-surface-hover disabled:opacity-50"
        />
        <p className="text-xs text-fg-subtle">{MAP_REQUIREMENTS_HINT}</p>
        {settings.mapImageUrl && (
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              name="removeMap"
              checked={removeMap}
              onChange={(e) => setRemoveMap(e.target.checked)}
              className="rounded border-line text-brand-fg focus:ring-brand-accent"
            />
            Remove current map
          </label>
        )}
      </div>

      <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
        {isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
