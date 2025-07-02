import { vi } from "vitest";
import { config } from "@vue/test-utils";

// Simple theme mock
const themeMock = {
  current: {
    colors: { primary: "#1867C0" },
    dark: false,
  },
  global: {
    name: "light",
  },
};

// Simple mock for Vuetify
const vuetifyMock = {
  theme: themeMock,
};

// Mock Nuxt's composables and app context
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
      currentRoute: { value: { path: "/", query: {}, params: {} } },
    },
    $vuetify: vuetifyMock,
  }),
  defineNuxtPlugin: vi.fn((fn) => fn),
  useRuntimeConfig: () => ({
    public: {
      // Add public config variables here
    },
  }),
  useState: vi.fn((key, init) => ({ value: init ? init() : undefined })),
  useRoute: vi.fn(() => ({ path: "/", query: {}, params: {} })),
  navigateTo: vi.fn(),
  definePageMeta: vi.fn(),
}));

// Basic stubs for all Vue test utils configurations
config.global.stubs = {
  NuxtLink: {
    template: "<a><slot /></a>",
    props: ["to"],
  },
  VApp: {
    template: "<div><slot /></div>",
  },
  VMain: {
    template: "<main><slot /></main>",
  },
  VContainer: {
    template: "<div><slot /></div>",
  },
  VRow: {
    template: "<div><slot /></div>",
  },
  VCol: {
    template: "<div><slot /></div>",
  },
  VFooter: {
    template: "<footer><slot /></footer>",
  },
  VIcon: {
    template: "<i><slot /></i>",
    props: ["icon"],
  },
  VImg: {
    template: '<div><slot name="placeholder" /></div>',
    props: ["src", "alt"],
  },
  VDivider: {
    template: "<hr />",
  },
  VTooltip: {
    template: "<div><slot /></div>",
    props: ["text"],
  },
  VBtn: {
    template: "<button><slot /></button>",
  },
  VProgressCircular: {
    template: "<div></div>",
    props: ["color", "size", "width", "indeterminate"],
  },
  transition: false,
  "transition-group": false,
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock document methods
document.getElementById = vi.fn();
document.createElement = vi.fn();

// Mock CSS imports
vi.mock("vuetify/styles", () => ({}));
vi.mock("vuetify/lib/styles/main.css", () => ({}));
vi.mock("vuetify/components/styles", () => ({}));
