/**
 * The 1-on-1 column's picture, in the header row where the rooms have theirs,
 * so the column reads as one of them. Drawn inline rather than served as a
 * file so it takes the theme's colours; a room photo has no such need.
 */
export function OneOnOnePicture() {
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label="Two people meeting"
      className="w-full aspect-[4/3] rounded bg-brand-tint text-brand-accent"
      style={{ maxHeight: 200 }}
    >
      <circle cx="138" cy="126" r="32" fill="currentColor" />
      <path
        d="M72 246c0-42 30-70 66-70s66 28 66 70v10H72z"
        fill="currentColor"
      />
      <circle cx="262" cy="126" r="32" fill="currentColor" opacity="0.7" />
      <path
        d="M196 246c0-42 30-70 66-70s66 28 66 70v10h-132z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* The conversation between them. */}
      <g className="text-fg-subtle" fill="currentColor">
        <circle cx="182" cy="72" r="6" />
        <circle cx="200" cy="64" r="6" />
        <circle cx="218" cy="72" r="6" />
      </g>
    </svg>
  );
}
