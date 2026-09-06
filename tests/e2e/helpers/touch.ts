import type { Locator } from "@playwright/test";

/**
 * A finger, in the only terms Playwright leaves for one: touch events on the
 * element under it. Dispatched one round trip at a time so the browser lays
 * out and paints between them, the way it would under a real thumb.
 */
export async function swipe(
  target: Locator,
  { by, down = 0, startX }: { by: number; down?: number; startX?: number }
) {
  const box = (await target.boundingBox())!;
  const x0 = startX ?? box.x + box.width / 2;
  const y0 = box.y + box.height / 2;
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const type =
      i === 0 ? "touchstart" : i === steps ? "touchend" : "touchmove";
    await target.page().evaluate(
      ({ type, x, y, x0, y0 }) => {
        // Whatever is under the finger, as a real touchscreen would have it:
        // the gesture is handled somewhere up the tree from there, and the
        // whole sequence goes to the element the finger landed on.
        const node = document.elementFromPoint(x0, y0);
        if (!node) throw new Error("nothing under the finger");
        const point = new Touch({
          identifier: 1,
          target: node,
          clientX: x,
          clientY: y,
        });
        const held = type === "touchend" ? [] : [point];
        node.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: held,
            targetTouches: held,
            changedTouches: [point],
          })
        );
      },
      { type, x: x0 + (by * i) / steps, y: y0 + (down * i) / steps, x0, y0 }
    );
  }
}
