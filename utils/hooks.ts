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
