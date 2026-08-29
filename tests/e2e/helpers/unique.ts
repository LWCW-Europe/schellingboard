let counter = 0;

/**
 * A suffix that makes a name unique across the whole run. `Date.now()` on its
 * own is not enough: the database is seeded once and shared, so a name has to
 * be unique across parallel workers too, and two of them can easily land in
 * the same millisecond. The process id separates the workers, the counter the
 * names within one.
 */
export function uniqueSuffix(): string {
  return `${process.pid}-${Date.now()}-${counter++}`;
}
