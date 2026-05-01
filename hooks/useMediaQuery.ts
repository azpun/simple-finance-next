import { useState, useEffect } from "react";

export const useMediaQuery = (breakpoint: number) => {
  const [isTargetReached, setIsTargetReached] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const mediaQuery = `(max-width: ${breakpoint - 1}px)`;
    const mediaQueryList = window.matchMedia(mediaQuery);

    // Update the document title using the browser API
    const onChange = () => {
      setIsTargetReached(window.innerWidth < breakpoint);
    };

    mediaQueryList.addEventListener("change", onChange);

    // check initial value on mount
    const initialMatches = () => {
      const isMatch = window.innerWidth < breakpoint;
      setIsTargetReached(isMatch);
      return isMatch;
    };

    initialMatches();

    return () => {
      mediaQueryList.removeEventListener("change", onChange);
    };
  }, [breakpoint]); // re-run the effect only if the breakpoint changes

  return !!isTargetReached;
};
