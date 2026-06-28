"use client";

export default function ClientTimestamp({ timestamp }: { timestamp: Date }) {
  return (
    <time dateTime={timestamp.toISOString()}>
      {timestamp.toLocaleDateString()}
    </time>
  );
}
