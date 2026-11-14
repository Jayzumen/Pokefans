import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

// jsdom lacks these browser APIs used by our components / Radix.
if (!Element.prototype.checkVisibility) {
  Element.prototype.checkVisibility = () => true;
}
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// next/image and next/link need Next's runtime; plain elements are enough
// for component tests. Next-only props are dropped so React doesn't warn.
const without = (props: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(Object.entries(props).filter(([k]) => !keys.includes(k)));

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    default: (props: Record<string, unknown>) =>
      React.createElement("img", without(props, ["priority", "fill"])),
  };
});
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: (props: Record<string, unknown>) =>
      React.createElement("a", without(props, ["prefetch", "transitionTypes"])),
  };
});
