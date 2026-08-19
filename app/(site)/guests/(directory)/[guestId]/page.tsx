/**
 * A profile has its own URL but no rendering of its own: the layout draws the
 * modal over the list whenever the path names a guest. That is what lets
 * Prev/Next move between profiles with a `pushState`, without a round trip and
 * without the list underneath being torn down.
 *
 * The route still has to exist — it is what makes `/guests/<id>` a real page
 * that can be linked to, opened in a new tab and reloaded.
 */
export default function GuestProfilePage() {
  return null;
}
