import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (typeof HTMLMediaElement !== "undefined") {
  Object.defineProperties(HTMLMediaElement.prototype, {
    load: {
      configurable: true,
      value: () => undefined,
    },
    play: {
      configurable: true,
      value: () => Promise.resolve(),
    },
  });
}

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
