<template>
  <v-app-bar
    color="app-bar"
    elevation="0"
    :border="true"
    class="app-header"
    role="banner"
  >
    <div
      class="header-container d-flex align-center justify-space-between py-0"
    >
      <!-- Site logo/branding -->
      <a
        :href="menuConfig.header.branding.href"
        class="text-decoration-none"
        :aria-label="menuConfig.header.branding.ariaLabel"
        @click.prevent="handleHomeClick"
      >
        <v-row no-gutters align="center">
          <v-col cols="auto">
            <div class="logo d-flex align-center">
              <v-icon
                :icon="menuConfig.header.branding.icon"
                :size="$vuetify.display.smAndDown ? 'large' : 'x-large'"
                color="primary"
                :class="$vuetify.display.smAndDown ? 'mr-1' : 'mr-2'"
                aria-hidden="true"
              />
              <!-- Responsive title display based on screen size -->
              <span
                class="d-none d-xl-block text-h6 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.text }}
              </span>
              <span
                class="d-none d-lg-block d-xl-none text-h6 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textMd }}
              </span>
              <span
                class="d-none d-sm-block d-lg-none text-subtitle-1 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textSm }}
              </span>
              <span
                class="d-block d-sm-none text-subtitle-1 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textXs }}
              </span>
            </div>
          </v-col>
        </v-row>
      </a>

      <!-- Mobile hamburger menu button (visible on sm and down) -->
      <div class="d-md-none">
        <v-btn
          icon
          variant="text"
          color="primary"
          :aria-label="menuConfig.header.mobile.ariaLabel"
          @click="mobileDrawerOpen = !mobileDrawerOpen"
        >
          <v-icon
            :icon="
              mobileDrawerOpen
                ? menuConfig.header.mobile.closeIcon
                : menuConfig.header.mobile.menuIcon
            "
            size="large"
          ></v-icon>
        </v-btn>
      </div>

      <!-- Desktop navigation (visible on md and up) -->
      <nav
        class="d-none d-md-flex align-center justify-end"
        aria-label="Main Navigation"
      >
        <!-- Dynamically generate navigation items from config, sorted by order property -->
        <template v-for="(item, index) in sortedHeaderItems" :key="index">
          <template v-if="shouldDisplayInDesktop(item)">
            <!-- Dropdown menu -->
            <v-menu
              v-if="item.hasDropdown"
              :open-on-hover="!item.iconOnly && !item.enableTooltip"
              :close-on-content-click="true"
              location="bottom start"
              offset="5"
              :model-value="openDropdowns[index]"
              @update:model-value="openDropdowns[index] = $event"
              @mouseleave="handleDropdownMouseLeave(index)"
              :class="{ 'more-menu-dropdown': item.isMoreMenu }"
            >
              <template v-slot:activator="{ props: menuProps }">
                <!-- Icon-only dropdown with tooltip (like More menu) -->
                <v-tooltip
                  v-if="item.iconOnly && tooltipsEnabled"
                  :model-value="tooltipStates[index]"
                  @update:model-value="tooltipStates[index] = $event"
                  location="bottom"
                  :text="item.tooltip || item.ariaLabel"
                  :disabled="openDropdowns[index]"
                  open-delay="200"
                  close-delay="0"
                >
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="{ ...menuProps, ...tooltipProps }"
                      :variant="item.variant"
                      :class="[
                        item.class,
                        { 'more-menu-btn': item.isMoreMenu },
                      ]"
                      :color="item.color"
                      :aria-label="item.ariaLabel"
                      :aria-haspopup="true"
                      :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                      @focus="handleIconOnlyDropdownFocus(index)"
                      @blur="handleDropdownBlur(index)"
                      @keydown.esc="openDropdowns[index] = false"
                      @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                      @mouseenter="handleTooltipMouseEnter(index)"
                      @mouseleave="handleTooltipMouseLeave(index)"
                      @click="handleIconOnlyDropdownClick(index)"
                    >
                      <v-icon :icon="item.icon" size="default"></v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Icon-only dropdown without tooltip (mobile) -->
                <v-btn
                  v-else-if="item.iconOnly"
                  v-bind="menuProps"
                  :variant="item.variant"
                  :class="[item.class, { 'more-menu-btn': item.isMoreMenu }]"
                  :color="item.color"
                  :aria-label="item.ariaLabel"
                  :aria-haspopup="true"
                  :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                  @focus="handleIconOnlyDropdownFocus(index)"
                  @blur="handleDropdownBlur(index)"
                  @keydown.esc="openDropdowns[index] = false"
                  @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                  @click="handleIconOnlyDropdownClick(index)"
                >
                  <v-icon :icon="item.icon" size="default"></v-icon>
                </v-btn>

                <!-- Regular dropdown button with text and optional tooltip -->
                <div
                  v-else-if="item.enableTooltip && tooltipsEnabled"
                  class="position-relative"
                >
                  <v-btn
                    v-bind="menuProps"
                    :variant="item.variant"
                    :class="[item.class, { 'more-menu-btn': item.isMoreMenu }]"
                    :color="item.color"
                    :aria-label="item.ariaLabel"
                    :aria-haspopup="true"
                    :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                    @focus="handleRegularDropdownFocus(index)"
                    @blur="handleDropdownBlur(index)"
                    @keydown.esc="openDropdowns[index] = false"
                    @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                    @mouseenter="handleTooltipMouseEnter(index)"
                    @mouseleave="handleTooltipMouseLeave(index)"
                    @click="handleRegularDropdownClick(index)"
                  >
                    {{ item.text }}
                    <v-icon
                      v-if="item.dropdownIcon"
                      :icon="item.dropdownIcon"
                      size="large"
                      class="ml-1 dropdown-chevron"
                      aria-hidden="true"
                    ></v-icon>
                  </v-btn>

                  <!-- Separate tooltip positioned relative to button -->
                  <v-tooltip
                    :model-value="tooltipStates[index]"
                    @update:model-value="tooltipStates[index] = $event"
                    location="bottom"
                    :text="item.tooltip || item.ariaLabel"
                    :disabled="openDropdowns[index]"
                    open-delay="200"
                    close-delay="0"
                    activator="parent"
                  />
                </div>

                <!-- Regular dropdown button without tooltip -->
                <v-btn
                  v-else
                  v-bind="menuProps"
                  :variant="item.variant"
                  :class="[item.class, { 'more-menu-btn': item.isMoreMenu }]"
                  :color="item.color"
                  :aria-label="item.ariaLabel"
                  :aria-haspopup="true"
                  :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                  @focus="openDropdowns[index] = true"
                  @blur="handleDropdownBlur(index)"
                  @keydown.esc="openDropdowns[index] = false"
                  @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                >
                  {{ item.text }}
                  <v-icon
                    v-if="item.dropdownIcon"
                    :icon="item.dropdownIcon"
                    size="large"
                    class="ml-1 dropdown-chevron"
                    aria-hidden="true"
                  ></v-icon>
                </v-btn>
              </template>

              <v-card class="dropdown-menu" elevation="4">
                <v-list density="compact" nav>
                  <template
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                  >
                    <!-- Divider item -->
                    <v-divider
                      v-if="child.isDivider"
                      class="dropdown-divider"
                      :class="child.class"
                    ></v-divider>

                    <!-- Regular dropdown item -->
                    <v-list-item
                      v-else
                      :value="`desktop-dropdown-${index}-item-${childIndex}`"
                      :to="child.to"
                      :href="child.href"
                      :target="child.isExternal ? child.target : undefined"
                      :rel="child.isExternal ? child.rel : undefined"
                      :aria-label="child.ariaLabel"
                      :class="child.class"
                      :color="child.color"
                      @focus="openDropdowns[index] = true"
                      @click="handleDropdownItemClick(index)"
                      @keydown.esc="openDropdowns[index] = false"
                      @keydown.up.prevent="
                        focusPrevDropdownItem(index, childIndex)
                      "
                      @keydown.down.prevent="
                        focusNextDropdownItem(index, childIndex)
                      "
                      @keydown.tab="
                        handleDropdownTabKey(
                          index,
                          childIndex,
                          item.children.length,
                          $event,
                        )
                      "
                    >
                      <v-list-item-title class="d-flex align-center">
                        <v-icon
                          v-if="child.icon"
                          :icon="child.icon"
                          size="small"
                          class="mr-2"
                          aria-hidden="true"
                        ></v-icon>
                        {{ child.text }}
                        <v-icon
                          v-if="child.isExternal && child.externalIcon"
                          :icon="child.externalIcon"
                          size="small"
                          class="ml-1"
                          aria-hidden="true"
                        ></v-icon>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-menu>

            <!-- Icon-only internal link with Vue Router -->
            <v-btn
              v-else-if="item.to && !item.isExternal && item.iconOnly"
              icon
              :variant="item.variant"
              :class="item.class"
              :to="item.to"
              :color="item.color"
              :aria-label="item.ariaLabel"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              <v-icon :icon="item.icon"></v-icon>
            </v-btn>

            <!-- Regular internal link with Vue Router and optional tooltip -->
            <div
              v-else-if="
                item.to &&
                !item.isExternal &&
                item.enableTooltip &&
                tooltipsEnabled
              "
              class="position-relative"
            >
              <v-btn
                :variant="item.variant"
                :class="item.class"
                :to="item.to"
                :color="item.color"
                :aria-label="item.ariaLabel"
                :aria-current="route.path === item.to ? 'page' : undefined"
                @mouseenter="handleTooltipMouseEnter(index)"
                @mouseleave="handleTooltipMouseLeave(index)"
                @click="handleTooltipClick(index)"
              >
                {{ item.text }}
              </v-btn>

              <!-- Separate tooltip positioned relative to button -->
              <v-tooltip
                :model-value="tooltipStates[index]"
                @update:model-value="tooltipStates[index] = $event"
                location="bottom"
                :text="item.tooltip || item.ariaLabel"
                open-delay="200"
                close-delay="0"
                activator="parent"
              />
            </div>

            <!-- Regular internal link with Vue Router without tooltip -->
            <v-btn
              v-else-if="item.to && !item.isExternal"
              :variant="item.variant"
              :class="item.class"
              :to="item.to"
              :color="item.color"
              :aria-label="item.ariaLabel"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              {{ item.text }}
            </v-btn>

            <!-- Home link with special handling -->
            <v-btn
              v-else-if="item.href === '/'"
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
              :aria-label="item.ariaLabel"
              :aria-current="route.path === '/' ? 'page' : undefined"
              @click.prevent="handleHomeClick"
            >
              {{ item.text }}
            </v-btn>

            <!-- External link with optional tooltip -->
            <div
              v-else-if="
                item.isExternal && item.enableTooltip && tooltipsEnabled
              "
              class="position-relative"
            >
              <v-btn
                :variant="item.variant"
                :class="item.class"
                :href="item.href"
                :color="item.color"
                :aria-label="item.ariaLabel"
                :target="item.target"
                :rel="item.rel"
                @mouseenter="handleTooltipMouseEnter(index)"
                @mouseleave="handleTooltipMouseLeave(index)"
                @click="handleTooltipClick(index)"
              >
                {{ item.text }}
                <v-icon
                  v-if="item.externalIcon"
                  :icon="item.externalIcon"
                  size="small"
                  class="ml-1"
                  aria-hidden="true"
                ></v-icon>
              </v-btn>

              <!-- Separate tooltip positioned relative to button -->
              <v-tooltip
                :model-value="tooltipStates[index]"
                @update:model-value="tooltipStates[index] = $event"
                location="bottom"
                :text="item.tooltip || item.ariaLabel"
                open-delay="200"
                close-delay="0"
                activator="parent"
              />
            </div>

            <!-- External link without tooltip -->
            <v-btn
              v-else-if="item.isExternal"
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
              :aria-label="item.ariaLabel"
              :target="item.target"
              :rel="item.rel"
            >
              {{ item.text }}
              <v-icon
                v-if="item.externalIcon"
                :icon="item.externalIcon"
                size="small"
                class="ml-1"
                aria-hidden="true"
              ></v-icon>
            </v-btn>

            <!-- Default link (internal non-router links) -->
            <v-btn
              v-else
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
              :aria-label="item.ariaLabel"
            >
              {{ item.text }}
            </v-btn>
          </template>
        </template>

        <!-- Theme toggle with good spacing -->
        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-8"
        />
      </nav>
    </div>
  </v-app-bar>

  <!-- Mobile navigation drawer -->
  <v-navigation-drawer
    v-model="mobileDrawerOpen"
    location="right"
    temporary
    width="280"
    class="mobile-nav-drawer"
    role="dialog"
    aria-modal="true"
    aria-label="Mobile Navigation Menu"
  >
    <v-list aria-label="Mobile Navigation Menu" role="navigation">
      <!-- Mobile navigation items, sorted by order property -->
      <template v-for="(item, index) in sortedHeaderItems" :key="index">
        <template v-if="shouldDisplayInMobile(item)">
          <!-- Dropdown menu item -->
          <template v-if="item.hasDropdown">
            <v-list-group
              :value="mobileExpandedDropdowns[index]"
              @click="toggleMobileDropdown(index)"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :class="item.mobileClass"
                  :aria-label="item.ariaLabel"
                >
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                  <template v-slot:append>
                    <v-icon
                      :icon="item.mobileDropdownIcon || 'mdi-chevron-right'"
                      size="large"
                      :class="{
                        'rotate-90': mobileExpandedDropdowns[index],
                        'mobile-dropdown-chevron': true,
                      }"
                      aria-hidden="true"
                    ></v-icon>
                  </template>
                </v-list-item>
              </template>

              <!-- Dropdown children -->
              <template
                v-for="(child, childIndex) in item.children"
                :key="`dropdown-${index}-child-${childIndex}`"
              >
                <!-- Divider item -->
                <v-divider
                  v-if="child.isDivider"
                  class="dropdown-divider-mobile"
                  :class="child.mobileClass"
                ></v-divider>

                <!-- Regular dropdown item -->
                <v-list-item
                  v-else-if="shouldDisplayInMobile(child)"
                  :value="`dropdown-${index}-item-${childIndex}`"
                  :to="child.to"
                  :href="child.href"
                  :target="child.isExternal ? child.target : undefined"
                  :rel="child.isExternal ? child.rel : undefined"
                  :class="[
                    child.mobileClass,
                    { 'more-menu-item': item.isMoreMenu },
                  ]"
                  :title="child.ariaLabel"
                  @click="handleMobileDropdownItemClick(index, child.href)"
                >
                  <v-list-item-title class="d-flex align-center">
                    <v-icon
                      v-if="child.icon"
                      :icon="child.icon"
                      size="small"
                      class="mr-2"
                      aria-hidden="true"
                    ></v-icon>
                    {{ child.text }}
                    <v-icon
                      v-if="child.isExternal && child.externalIcon"
                      :icon="child.externalIcon"
                      size="small"
                      class="ml-1"
                      aria-hidden="true"
                    ></v-icon>
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-list-group>
          </template>

          <!-- Regular menu item -->
          <v-list-item
            v-else
            :value="`mobile-nav-item-${index}`"
            :to="item.to"
            :href="item.href"
            :target="item.isExternal ? item.target : undefined"
            :rel="item.isExternal ? item.rel : undefined"
            :class="item.mobileClass"
            :title="item.ariaLabel"
            @click="item.href === '/' ? handleHomeClick() : undefined"
          >
            <v-list-item-title class="d-flex align-center">
              <v-icon
                v-if="item.iconOnly && item.icon"
                :icon="item.icon"
                size="default"
                class="mr-2"
                aria-hidden="true"
              ></v-icon>
              {{
                item.iconOnly
                  ? item.isMoreMenu
                    ? item.text
                    : "Search"
                  : item.text
              }}
              <v-icon
                v-if="item.isExternal && item.externalIcon"
                :icon="item.externalIcon"
                size="small"
                class="ml-1"
                aria-hidden="true"
              ></v-icon>
            </v-list-item-title>
          </v-list-item>
        </template>
      </template>

      <!-- Theme toggle in mobile menu -->
      <v-list-item class="mt-4">
        <v-list-item-title>
          <ThemeSwitch
            :theme="theme"
            @toggle-theme="$emit('toggle-theme')"
            class="ml-2"
          />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
/**
 * Application header component with navigation and theme toggle
 *
 * This component provides:
 * - Main site navigation with accessible links
 * - Site branding and logo
 * - Theme toggle switch
 * - Proper ARIA attributes for accessibility
 * - Scroll to top functionality for homepage links
 * - Configuration-based navigation structure
 *
 * @component
 */
import ThemeSwitch from "./ThemeSwitch.vue";
import {
  useRouter,
  useRoute,
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from "#imports";
import menuConfig from "~/config/menu.config.json";
import siteConfig from "~/config/site.config.json";

/**
 * Component props
 */
defineProps({
  /**
   * Current theme ('light' or 'dark')
   */
  theme: {
    type: String,
    required: true,
  },

  /**
   * ARIA role for the component
   * This is inherited from the parent component
   */
  role: {
    type: String,
    default: "banner",
  },
});

// Import Vuetify's useDisplay composable for responsive detection
import { useDisplay } from "vuetify";

/**
 * Define emits for the component
 * toggle-theme: Emitted when theme switch is toggled
 */
defineEmits(["toggle-theme"]);

// Get Nuxt app instance to access plugins
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Get Vuetify display breakpoints for responsive behavior
const { mobile } = useDisplay();

/**
 * State for tracking open dropdown menus in desktop view
 * Each index corresponds to a navigation item
 */
const openDropdowns = ref({});

/**
 * State for tracking mobile navigation drawer
 */
const mobileDrawerOpen = ref(false);

/**
 * State for tracking expanded dropdown menus in mobile view
 */
const mobileExpandedDropdowns = ref({});

/**
 * State for tracking tooltip visibility for icon-only menu items
 */
const tooltipStates = ref({});

/**
 * Timers for auto-dismissing tooltips after 2 seconds
 */
const tooltipTimers = ref({});

/**
 * Computed property to determine if tooltips should be enabled
 * Tooltips are only enabled on desktop (not mobile)
 */
const tooltipsEnabled = computed(() => !mobile.value);

/**
 * Computed property to generate dynamic "More" menu children from site config
 */
const moreMenuChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.moreMenu?.enabled) {
    return [];
  }

  const moreMenuConfig = siteConfig.ui.navigation.moreMenu;
  const children = [];

  // Add enabled items from site config
  Object.entries(moreMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled) {
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
        isExternal: item.isExternal || false,
        target: item.isExternal ? "_blank" : undefined,
        rel: item.isExternal ? "noopener noreferrer" : undefined,
      });
    }
  });

  return children;
});

/**
 * Computed property to sort header items by order property and inject dynamic children
 * Items without an order property will be placed at the end
 */
const sortedHeaderItems = computed(() => {
  const items = [...menuConfig.header.items].map((item) => {
    // If this is the "More" menu, inject dynamic children
    if (item.isMoreMenu && siteConfig.ui?.navigation?.moreMenu?.enabled) {
      return {
        ...item,
        children: moreMenuChildren.value,
        text: siteConfig.ui.navigation.moreMenu.mobileText || "More",
      };
    }
    return item;
  });

  return items.sort((a, b) => {
    // Default order for items without an order property
    const orderA = a.order || 1000;
    const orderB = b.order || 1000;
    return orderA - orderB;
  });
});

/**
 * Determine if an item should be displayed in desktop view
 * @param {Object} item - Navigation item from config
 * @returns {boolean} - Whether the item should be displayed in desktop view
 */
const shouldDisplayInDesktop = (item) => {
  return item.displayMode === "desktop" || item.displayMode === "both";
};

/**
 * Determine if an item should be displayed in mobile view
 * @param {Object} item - Navigation item from config
 * @returns {boolean} - Whether the item should be displayed in mobile view
 */
const shouldDisplayInMobile = (item) => {
  return item.displayMode === "mobile" || item.displayMode === "both";
};

/**
 * Toggle a dropdown menu in mobile view
 * @param {number} index - Index of the dropdown menu to toggle
 */
const toggleMobileDropdown = (index) => {
  mobileExpandedDropdowns.value[index] = !mobileExpandedDropdowns.value[index];
};

/**
 * Initialize dropdown state for each navigation item - client-side only
 * Wrapped in process.client to prevent hydration mismatches
 */
if (process.client) {
  onMounted(() => {
    // Initialize all dropdowns and tooltips as closed
    menuConfig.header.items.forEach((item, index) => {
      if (item.hasDropdown) {
        openDropdowns.value[index] = false;
        mobileExpandedDropdowns.value[index] = false;
      }
      // Initialize tooltip state for icon-only items and items with enableTooltip
      if (item.iconOnly || item.enableTooltip) {
        tooltipStates.value[index] = false;
      }
    });

    // Add global click handler to close dropdowns and tooltips when clicking outside
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleOutsideClick);
    }

    // Add router navigation hook to close all dropdowns and tooltips when navigation occurs
    router.afterEach(() => {
      // Close all desktop dropdowns
      Object.keys(openDropdowns.value).forEach((key) => {
        openDropdowns.value[key] = false;
      });

      // Close all mobile dropdowns
      Object.keys(mobileExpandedDropdowns.value).forEach((key) => {
        mobileExpandedDropdowns.value[key] = false;
      });

      // Close all tooltips and clear timers
      Object.keys(tooltipStates.value).forEach((key) => {
        tooltipStates.value[key] = false;
        if (tooltipTimers.value[key]) {
          clearTimeout(tooltipTimers.value[key]);
          delete tooltipTimers.value[key];
        }
      });

      // Close mobile drawer
      mobileDrawerOpen.value = false;
    });
  });
}

/**
 * Clean up event listeners and timers on component unmount - client-side only
 */
if (process.client) {
  onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleOutsideClick);
    }

    // Clear all tooltip timers
    Object.keys(tooltipTimers.value).forEach((key) => {
      if (tooltipTimers.value[key]) {
        clearTimeout(tooltipTimers.value[key]);
        delete tooltipTimers.value[key];
      }
    });
  });
}

/**
 * Close dropdowns and tooltips when clicking outside
 */
const handleOutsideClick = (event) => {
  // Check if click is outside dropdown menus and their activators
  const isOutsideDropdown =
    !event.target.closest(".v-menu") &&
    !event.target.closest('.v-btn[aria-haspopup="true"]');

  // Check if click is outside tooltips and their activators
  const isOutsideTooltip =
    !event.target.closest(".v-tooltip") && !event.target.closest(".v-btn");

  if (isOutsideDropdown) {
    // Close all dropdowns
    Object.keys(openDropdowns.value).forEach((key) => {
      openDropdowns.value[key] = false;
    });
  }

  if (isOutsideTooltip) {
    // Close all tooltips and clear timers
    Object.keys(tooltipStates.value).forEach((key) => {
      tooltipStates.value[key] = false;
      if (tooltipTimers.value[key]) {
        clearTimeout(tooltipTimers.value[key]);
        delete tooltipTimers.value[key];
      }
    });
  }
};

/**
 * Handle blur events on dropdown activator buttons
 * Delay closing to allow focus to move to dropdown items
 */
const handleDropdownBlur = (index) => {
  setTimeout(() => {
    // Check if focus is still within the dropdown
    const activeElement = document.activeElement;
    const isInDropdown =
      activeElement &&
      (activeElement.closest(".v-menu") ||
        activeElement.getAttribute("aria-haspopup") === "true");

    if (!isInDropdown) {
      openDropdowns.value[index] = false;
    }
  }, 100);
};

/**
 * Focus the next item in a dropdown menu
 */
const focusNextDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll(".v-menu")[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll(".v-list-item");
  const nextIndex =
    currentItemIndex + 1 < items.length ? currentItemIndex + 1 : 0;

  if (items[nextIndex]) {
    items[nextIndex].focus();
  }
};

/**
 * Focus the previous item in a dropdown menu
 */
const focusPrevDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll(".v-menu")[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll(".v-list-item");
  const prevIndex =
    currentItemIndex - 1 >= 0 ? currentItemIndex - 1 : items.length - 1;

  if (items[prevIndex]) {
    items[prevIndex].focus();
  }
};

/**
 * Handle tab key in dropdown menu to ensure proper focus management
 */
const handleDropdownTabKey = (
  dropdownIndex,
  currentItemIndex,
  totalItems,
  event,
) => {
  // If tabbing from the last item, close the dropdown
  if (currentItemIndex === totalItems - 1 && !event.shiftKey) {
    openDropdowns.value[dropdownIndex] = false;
  }
};

/**
 * Handle click on dropdown menu items in desktop view
 * Closes the dropdown menu when an item is clicked
 * @param {number} index - Index of the dropdown menu
 */
const handleDropdownItemClick = (index) => {
  // Close the dropdown after a short delay to allow navigation to start
  setTimeout(() => {
    openDropdowns.value[index] = false;
  }, 100);
};

/**
 * Handle mouseleave event on dropdown menu in desktop view
 * Closes the dropdown menu when mouse leaves the dropdown area
 * @param {number} index - Index of the dropdown menu
 */
const handleDropdownMouseLeave = (index) => {
  // Close the dropdown when mouse leaves the dropdown area
  openDropdowns.value[index] = false;
};

/**
 * Handle click on dropdown menu items in mobile view
 * Closes the dropdown menu and mobile drawer when an item is clicked
 * @param {number} index - Index of the dropdown menu
 * @param {string} href - The href attribute of the clicked item
 */
const handleMobileDropdownItemClick = (index, href) => {
  // Close the dropdown
  mobileExpandedDropdowns.value[index] = false;

  // Close the mobile drawer
  mobileDrawerOpen.value = false;

  // Handle home link special case
  if (href === "/") {
    handleHomeClick();
  }
};

/**
 * Handle click on home links
 * If already on homepage, just scroll to top
 * Otherwise navigate to homepage
 */
const handleHomeClick = () => {
  if (route.path === "/") {
    // Already on homepage, just scroll to top
    nuxtApp.$scrollToTop();
  } else {
    // Navigate to homepage
    router.push("/");
  }
};

/**
 * Handle mouse enter on tooltip activator
 * Shows tooltip and sets auto-dismiss timer (only on desktop)
 * @param {number} index - Index of the menu item
 */
const handleTooltipMouseEnter = (index) => {
  // Only show tooltips on desktop
  if (!tooltipsEnabled.value) return;

  // Clear any existing timer
  if (tooltipTimers.value[index]) {
    clearTimeout(tooltipTimers.value[index]);
    delete tooltipTimers.value[index];
  }

  // Show tooltip
  tooltipStates.value[index] = true;

  // Set auto-dismiss timer for 2 seconds
  tooltipTimers.value[index] = setTimeout(() => {
    tooltipStates.value[index] = false;
    delete tooltipTimers.value[index];
  }, 2000);
};

/**
 * Handle mouse leave on tooltip activator
 * Hides tooltip immediately (only on desktop)
 * @param {number} index - Index of the menu item
 */
const handleTooltipMouseLeave = (index) => {
  // Only handle tooltips on desktop
  if (!tooltipsEnabled.value) return;

  // Clear timer
  if (tooltipTimers.value[index]) {
    clearTimeout(tooltipTimers.value[index]);
    delete tooltipTimers.value[index];
  }

  // Hide tooltip
  tooltipStates.value[index] = false;
};

/**
 * Handle click on tooltip activator (for regular navigation links)
 * Hides tooltip immediately (only on desktop)
 * @param {number} index - Index of the menu item
 */
const handleTooltipClick = (index) => {
  // Only handle tooltips on desktop
  if (!tooltipsEnabled.value) return;

  // Clear timer
  if (tooltipTimers.value[index]) {
    clearTimeout(tooltipTimers.value[index]);
    delete tooltipTimers.value[index];
  }

  // Hide tooltip
  tooltipStates.value[index] = false;
};

/**
 * Handle click on icon-only dropdown activator
 * Hides tooltip and opens dropdown
 * @param {number} index - Index of the menu item
 */
const handleIconOnlyDropdownClick = (index) => {
  // Clear tooltip timer and hide tooltip (only on desktop)
  if (tooltipsEnabled.value) {
    if (tooltipTimers.value[index]) {
      clearTimeout(tooltipTimers.value[index]);
      delete tooltipTimers.value[index];
    }
    tooltipStates.value[index] = false;
  }

  // Toggle dropdown
  openDropdowns.value[index] = !openDropdowns.value[index];
};

/**
 * Handle focus on icon-only dropdown activator
 * Hides tooltip and opens dropdown
 * @param {number} index - Index of the menu item
 */
const handleIconOnlyDropdownFocus = (index) => {
  // Clear tooltip timer and hide tooltip (only on desktop)
  if (tooltipsEnabled.value) {
    if (tooltipTimers.value[index]) {
      clearTimeout(tooltipTimers.value[index]);
      delete tooltipTimers.value[index];
    }
    tooltipStates.value[index] = false;
  }

  // Open dropdown on focus
  openDropdowns.value[index] = true;
};

/**
 * Handle click on regular dropdown activator with tooltip
 * Hides tooltip and opens dropdown
 * @param {number} index - Index of the menu item
 */
const handleRegularDropdownClick = (index) => {
  // Clear tooltip timer and hide tooltip (only on desktop)
  if (tooltipsEnabled.value) {
    if (tooltipTimers.value[index]) {
      clearTimeout(tooltipTimers.value[index]);
      delete tooltipTimers.value[index];
    }
    tooltipStates.value[index] = false;
  }

  // Toggle dropdown
  openDropdowns.value[index] = !openDropdowns.value[index];
};

/**
 * Handle focus on regular dropdown activator with tooltip
 * Hides tooltip and opens dropdown
 * @param {number} index - Index of the menu item
 */
const handleRegularDropdownFocus = (index) => {
  // Clear tooltip timer and hide tooltip (only on desktop)
  if (tooltipsEnabled.value) {
    if (tooltipTimers.value[index]) {
      clearTimeout(tooltipTimers.value[index]);
      delete tooltipTimers.value[index];
    }
    tooltipStates.value[index] = false;
  }

  // Open dropdown on focus
  openDropdowns.value[index] = true;
};
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
}

/* Desktop navigation styles */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--v-primary-base);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.router-link-active::after {
  width: 60%;
}

.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Dropdown menu styles for desktop */
.dropdown-menu {
  border-radius: 4px;
  min-width: 200px;
  width: max-content;
  overflow: hidden;
}

.dropdown-item {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  border-left: 3px solid transparent;
  padding-left: 16px !important;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left-color: var(--v-theme-primary);
}

.dropdown-item:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: -2px;
}

/* Dropdown divider styles */
.dropdown-divider {
  margin: 8px 0;
  opacity: 0.3;
}

.dropdown-divider-mobile {
  margin: 8px 16px;
  opacity: 0.3;
}

/* Navigation download button custom styling - subtle card-like approach */
.nav-download-btn {
  /* Light theme: pure white background like cards for subtle contrast against light grey nav bar */
  background-color: #ffffff !important; /* Same as NewsCard and search cards */
  color: #0747a6 !important; /* Primary color text */
  border: 1px solid rgba(0, 0, 0, 0.05) !important; /* Subtle border like cards */
  transition: all 0.3s ease;
}

.nav-download-btn:hover {
  background-color: #f8f8f8 !important; /* Slightly darker on hover */
  color: #053285 !important; /* Darker primary on hover */
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

/* Dark theme: lighter surface background like cards for contrast against dark nav bar */
:root[data-theme="dark"] .nav-download-btn {
  background-color: #2a3441 !important; /* Same as NewsCard and search cards */
  color: #93c5fd !important; /* Theme primary color text */
  border: 1px solid rgba(255, 255, 255, 0.05) !important; /* Subtle border like cards */
}

:root[data-theme="dark"] .nav-download-btn:hover {
  background-color: #334155 !important; /* Slightly lighter on hover */
  color: #bfdbfe !important; /* Lighter blue on hover */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4) !important;
}

/* Simple theme toggle spacing */

/* Mobile navigation styles */
.mobile-nav-drawer {
  z-index: 1000;
}

.nav-link-mobile {
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link-mobile:hover,
.nav-link-mobile:focus,
.nav-link-mobile.router-link-active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left-color: var(--v-theme-primary);
}

.dropdown-item-mobile {
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.dropdown-item-mobile:hover,
.dropdown-item-mobile:focus,
.dropdown-item-mobile.router-link-active {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
  border-left-color: var(--v-theme-primary);
}

/* Enhanced dropdown chevron styling for better visibility */
.dropdown-chevron {
  font-weight: 900 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
  transform: scale(1.2);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dropdown-chevron:hover {
  transform: scale(1.3);
  opacity: 1 !important;
}

.mobile-dropdown-chevron {
  font-weight: 900 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
  transform: scale(1.2);
  transition:
    transform 0.3s ease,
    opacity 0.2s ease;
}

.mobile-dropdown-chevron:hover {
  transform: scale(1.3);
  opacity: 1 !important;
}

/* Animation for mobile dropdown chevron */
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.v-list-item-title {
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1600px; /* Wider than default container */
  margin: 0 auto;
  padding: 0 16px; /* Minimum padding on small screens */
}

/* Responsive padding adjustments */
@media (min-width: 600px) {
  .header-container {
    padding: 0 24px;
  }
}

@media (min-width: 960px) {
  .header-container {
    padding: 0 32px;
  }
}

/* Enhanced target size for accessibility - WCAG 2.5.5 Target Size (Enhanced) */
/* Ensure all interactive elements meet 44x44 pixel minimum target size */
.app-header .v-btn {
  min-width: 44px !important;
  min-height: 44px !important;
}

/* Specific styling for icon-only buttons to ensure proper target size */
.app-header .v-btn[icon] {
  min-width: 44px !important;
  min-height: 44px !important;
  width: 44px !important;
  height: 44px !important;
}

/* Mobile navigation list items target size enhancement */
.mobile-nav-drawer .v-list-item {
  min-height: 44px !important;
  padding: 8px 16px !important;
}

/* Mobile navigation dropdown items target size enhancement */
.mobile-nav-drawer .v-list-group .v-list-item {
  min-height: 44px !important;
}

/* Dropdown menu items target size enhancement */
.dropdown-menu .v-list-item {
  min-height: 44px !important;
  padding: 8px 16px !important;
}

/* Logo/branding link target size enhancement */
.app-header a[aria-label*="homepage"],
.app-header a[aria-label*="home"] {
  min-height: 44px !important;
  display: flex !important;
  align-items: center !important;
  padding: 4px 8px !important;
}
</style>
