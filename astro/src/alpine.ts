/**
 * @astrojs/alpinejs entrypoint — registers Alpine plugins before Alpine.start().
 * Wired via `alpinejs({ entrypoint: "/src/alpine" })` in astro.config.ts.
 *
 * focus → provides x-trap (mobile drawer focus trap + .noscroll body lock).
 */
import type { Alpine } from "alpinejs";
import focus from "@alpinejs/focus";

export default (Alpine: Alpine) => {
  Alpine.plugin(focus);
};
