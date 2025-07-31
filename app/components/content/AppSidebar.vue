<template>
  <v-navigation-drawer
    v-model="isOpen"
    temporary
    location="right"
    width="280"
    class="mobile-nav-drawer"
    role="dialog"
    aria-modal="true"
    aria-label="Mobile Navigation Menu"
  >
    <v-list aria-label="Mobile Navigation Menu" role="navigation">
      <!-- Theme toggle at top of mobile menu -->
      <v-list-item class="mb-4 d-flex justify-center">
        <ThemeSwitch :theme="theme" @toggle-theme="$emit('toggle-theme')" />
      </v-list-item>

      <!-- Home (dynamic from menu config) -->
      <v-list-item
        v-if="homeItem"
        value="mobile-nav-home"
        :to="homeItem.to"
        :active="route.path === homeItem.to"
        :class="homeItem.mobileClass || 'font-weight-bold py-2 nav-link-mobile'"
        :title="homeItem.tooltip"
        :aria-label="homeItem.ariaLabel"
        @click="handleNavigation(homeItem.to)"
      >
        <template #title>
          <span class="font-weight-black text-uppercase">{{
            homeItem.text
          }}</span>
        </template>
      </v-list-item>

      <!-- Read the Plan dropdown (dynamic from menu config) -->
      <v-list-item
        v-if="readThePlanItem"
        class="font-weight-bold py-2 nav-link-mobile dropdown-menu-heading"
        :aria-label="readThePlanItem.ariaLabel"
        role="heading"
        aria-level="2"
      >
        <template #title>
          <span class="font-weight-black text-uppercase">{{
            readThePlanItem.text
          }}</span>
        </template>
      </v-list-item>

      <!-- Read the Plan children (dynamic from menu config) -->
      <template
        v-for="(planItem, planIndex) in readThePlanChildren"
        :key="`plan-${planIndex}`"
      >
        <!-- Divider item -->
        <v-divider
          v-if="planItem.isDivider"
          class="dropdown-divider-mobile mx-4"
        ></v-divider>

        <!-- Plan menu item (indented) -->
        <v-list-item
          v-else
          :value="`plan-item-${planIndex}`"
          :to="planItem.to"
          :href="planItem.href"
          :target="planItem.isExternal ? planItem.target : undefined"
          :rel="planItem.isExternal ? planItem.rel : undefined"
          :active="
            planItem.to &&
            (route.path === planItem.to || route.path === planItem.to + '/')
          "
          :class="
            planItem.mobileClass ||
            'dropdown-item-mobile ml-4 dropdown-menu-item pl-8'
          "
          :title="planItem.tooltip"
          :aria-label="planItem.ariaLabel"
          @click="handleNavigation(planItem.to || planItem.href)"
        >
          <template #title>
            <div class="d-flex align-center">
              <v-icon
                v-if="planItem.icon"
                :icon="planItem.icon"
                size="small"
                class="mr-2"
                aria-hidden="true"
              ></v-icon>
              {{ truncateMiddle(planItem.text, 35) }}
              <v-icon
                v-if="planItem.isExternal && planItem.externalIcon"
                :icon="planItem.externalIcon"
                size="small"
                class="ml-1"
                aria-hidden="true"
              ></v-icon>
            </div>
          </template>
        </v-list-item>
      </template>

      <!-- More menu (dynamic from site config) -->
      <v-list-item
        v-if="moreMenuChildren.length > 0"
        class="font-weight-bold py-2 nav-link-mobile more-menu-heading"
        aria-label="More options section"
        role="heading"
        aria-level="2"
      >
        <template #title>
          <span class="font-weight-black text-uppercase">{{
            siteConfig.ui?.navigation?.moreMenu?.mobileText || "More"
          }}</span>
        </template>
      </v-list-item>

      <!-- More menu children (dynamic from site config) -->
      <template
        v-for="(moreItem, moreIndex) in moreMenuChildren"
        :key="`more-${moreIndex}`"
      >
        <!-- More menu item (indented) -->
        <v-list-item
          :value="`more-item-${moreIndex}`"
          :to="moreItem.to"
          :href="moreItem.href"
          :target="moreItem.isExternal ? moreItem.target : undefined"
          :rel="moreItem.isExternal ? moreItem.rel : undefined"
          :active="
            moreItem.to &&
            (route.path === moreItem.to || route.path === moreItem.to + '/')
          "
          :class="
            moreItem.mobileClass ||
            'dropdown-item-mobile ml-4 more-menu-item pl-8'
          "
          :title="moreItem.tooltip"
          :aria-label="moreItem.ariaLabel"
          @click="handleNavigation(moreItem.to || moreItem.href)"
        >
          <template #title>
            <div class="d-flex align-center">
              <v-icon
                v-if="moreItem.icon"
                :icon="moreItem.icon"
                size="small"
                class="mr-2"
                aria-hidden="true"
              ></v-icon>
              {{ truncateMiddle(moreItem.text, 30) }}
              <v-icon
                v-if="moreItem.isExternal && moreItem.externalIcon"
                :icon="moreItem.externalIcon"
                size="small"
                class="ml-1"
                aria-hidden="true"
              ></v-icon>
            </div>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
/**
 * Mobile navigation sidebar component
 * Provides clean, isolated mobile navigation without duplication issues
 * Dynamically generates menu items from menu configuration
 */

// Imports
import menuConfig from "../../../config/menu.config.json";
import siteConfig from "../../../config/site.config.json";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "light",
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "toggle-theme"]);

// Composables
const route = useRoute();

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

/**
 * Get the "Read the Plan" menu item from menu config
 */
const readThePlanItem = computed(() => {
  return menuConfig.header.items.find(
    (item) => item.text === "Read the Plan" && item.hasDropdown
  );
});

/**
 * Get the "Read the Plan" menu children from site config (same as AppHeader)
 */
const readThePlanChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.readThePlanMenu?.enabled) {
    return [];
  }

  const readThePlanMenuConfig = siteConfig.ui.navigation.readThePlanMenu;
  const children = [];

  // Add enabled items from site config (excluding dividers for sidebar)
  Object.entries(readThePlanMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled) {
      // Handle regular menu items only
      children.push({
        text: item.text,
        to: item.to,
        href: item.href,
        ariaLabel: item.ariaLabel,
        class: "dropdown-item",
        mobileClass: "dropdown-item-mobile ml-4",
        color: "on-app-bar",
        displayMode: "both",
        isExternal: item.isExternal,
        target: item.target,
        rel: item.rel,
      });
    }
  });

  return children;
});

/**
 * Get the "More" menu children from site config (same as AppHeader)
 */
const moreMenuChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.moreMenu?.enabled) {
    return [];
  }

  const moreMenuConfig = siteConfig.ui.navigation.moreMenu;
  const children = [];

  // Add enabled items from site config (excluding dividers for sidebar)
  Object.entries(moreMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled && !item.isDivider) {
      // Handle regular menu items only (skip dividers in sidebar)
      children.push({
        text: item.text,
        to: item.to,
        href: item.href,
        ariaLabel: item.ariaLabel,
        tooltip: item.tooltip,
        tooltipLocation: "right",
        class: "dropdown-item",
        mobileClass: "dropdown-item-mobile ml-4",
        color: "on-app-bar",
        displayMode: "both",
        icon: item.icon,
        isExternal: item.isExternal,
        target: item.target,
        rel: item.rel,
        externalIcon: item.externalIcon,
      });
    }
  });

  return children;
});

/**
 * Get the Home menu item from menu config
 */
const homeItem = computed(() => {
  return menuConfig.header.items.find((item) => item.text === "Home");
});

/**
 * Get the Download menu item from menu config
 */
const downloadItem = computed(() => {
  return menuConfig.header.items.find((item) => item.text === "Download");
});

/**
 * Handle navigation and close sidebar
 * @param {string} path - The path to navigate to
 */
const handleNavigation = (path) => {
  if (path === "/") {
    // Handle home navigation if needed
  }
  // Close sidebar after navigation
  isOpen.value = false;
};

/**
 * Truncate text in the middle with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis in the middle
 */
const truncateMiddle = (text, maxLength = 30) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const ellipsis = "...";
  const charsToShow = maxLength - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    text.substring(0, frontChars) +
    ellipsis +
    text.substring(text.length - backChars)
  );
};
</script>

<style scoped>
/* Mobile navigation specific styles */
.mobile-nav-drawer {
  z-index: 9999;
}

.nav-link-mobile {
  border-radius: 0;
}

.dropdown-menu-heading,
.more-menu-heading {
  pointer-events: none;
  opacity: 0.8;
}

.dropdown-menu-item,
.more-menu-item {
  border-radius: 0;
}

.dropdown-divider-mobile {
  margin: 8px 0;
}
</style>
