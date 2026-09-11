import {
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";

export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const subscribeToNothing = () => () => {};

/**
 * The viewer's IANA timezone, or null on the server and during the first
 * hydration pass — the server can't know it, so rendering it directly would
 * not survive hydration. Pass it to `formatInLocalZone`, which falls back to
 * the event's zone until the swap happens.
 */
export function useLocalZone(): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null
  );
}

/**
 * The site's origin as the browser sees it, or null on the server and during
 * the first hydration pass. For links that must be absolute to mean anything
 * once they leave the site, such as a calendar entry's link back.
 */
export function useSiteOrigin(): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.origin,
    () => null
  );
}

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useSafeLayoutEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenWidth;
};
