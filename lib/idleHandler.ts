"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const IDLE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 jam

export const IdleHandler = () => {
  const timerRef = useRef<null | NodeJS.Timeout>(null);

  const logout = () => {
    signOut({
      callbackUrl: "/auth/login",
    });
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const event = [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "touchstart",
    ];

    resetTimer();

    event.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      event.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
};
