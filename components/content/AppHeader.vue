<template>
  <v-app-bar
    color="app-bar"
    elevation="0"
    :border="true"
    class="app-header"
    role="banner"
  >
    <div class="header-container d-flex align-center justify-space-between py-0">
      <!-- Site logo/branding -->
      <AccessibleTooltip
        :text="menuConfig.header.branding.tooltip"
        :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
      >
        <template v-slot="{ props }">
          <a
            :href="menuConfig.header.branding.href"
            class="text-decoration-none"
            v-bind="props"
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
                  <span class="d-none d-xl-block text-h6 font-weight-bold text-primary">
                    {{ menuConfig.header.branding.text }}
                  </span>
                  <span class="d-none d-lg-block d-xl-none text-h6 font-weight-bold text-primary">
                    {{ menuConfig.header.branding.textMd }}
                  </span>
                  <span class="d-none d-sm-block d-lg-none text-subtitle-1 font-weight-bold text-primary">
                    {{ menuConfig.header.branding.textSm }}
                  </span>
                  <span class="d-block d-sm-none text-subtitle-1 font-weight-bold text-primary">
                    {{ menuConfig.header.branding.textXs }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </a>
        </template>
      </AccessibleTooltip>

      <!-- Main navigation -->
      <nav class="d-flex align-center justify-end" aria-label="Main Navigation">
        <!-- Dynamically generate navigation items from config -->
        <template v-for="(item, index) in menuConfig.header.items" :key="index">
          <AccessibleTooltip
            :text="item.tooltip"
            :location="$vuetify.display.smAndDown ? 'bottom' : item.tooltipLocation || 'bottom'"
          >
            <template v-slot="{ props }">
              <!-- Dropdown menu -->
              <v-menu
                v-if="item.hasDropdown"
                open-on-hover
                :close-on-content-click="false"
                location="bottom"
                offset="5"
              >
                <template v-slot:activator="{ props: menuProps }">
                  <v-btn
                    v-bind="{ ...props, ...menuProps }"
                    :variant="item.variant"
                    :class="item.class"
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
                      size="small"
                      class="ml-1"
                      aria-hidden="true"
                    ></v-icon>
                  </v-btn>
                </template>

                <v-card class="dropdown-menu" elevation="4">
                  <v-list density="compact" nav>
                    <v-list-item
                      v-for="(child, childIndex) in item.children"
                      :key="childIndex"
                      :value="childIndex"
                      :to="child.to"
                      :href="child.href"
                      :target="child.isExternal ? child.target : undefined"
                      :rel="child.isExternal ? child.rel : undefined"
                      :aria-label="child.ariaLabel"
                      :class="child.class"
                      :color="child.color"
                      @focus="openDropdowns[index] = true"
                      @keydown.esc="openDropdowns[index] = false"
                      @keydown.up.prevent="focusPrevDropdownItem(index, childIndex)"
                      @keydown.down.prevent="focusNextDropdownItem(index, childIndex)"
                      @keydown.tab="handleDropdownTabKey(index, childIndex, item.children.length, $event)"
                    >
                      <v-list-item-title>
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
                  </v-list>
                </v-card>
              </v-menu>

              <!-- Internal link with Vue Router -->
              <v-btn
                v-else-if="item.to && !item.isExternal"
                v-bind="props"
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
                v-bind="props"
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

              <!-- External link -->
              <v-btn
                v-else-if="item.isExternal"
                v-bind="props"
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
                v-bind="props"
                :variant="item.variant"
                :class="item.class"
                :href="item.href"
                :color="item.color"
                :aria-label="item.ariaLabel"
              >
                {{ item.text }}
              </v-btn>
            </template>
          </AccessibleTooltip>
        </template>

        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-4"
        />
      </nav>
    </div>
  </v-app-bar>
</template>

<script setup>
/**
 * Application header component with navigation and theme toggle
 *
 * This component provides:
 * - Main site navigation with accessible links
 * - Site branding and logo
 * - Theme toggle switch
 * - Tooltips for improved usability
 * - Proper ARIA attributes for accessibility
 * - Scroll to top functionality for homepage links
 * - Configuration-based navigation structure
 *
 * @component
 */
import ThemeSwitch from './ThemeSwitch.vue';
import AccessibleTooltip from './AccessibleTooltip.vue';
import { useRouter, useRoute, ref, onMounted, onBeforeUnmount } from '#imports';
import menuConfig from '~/config/menu.config.json';

/**
 * Component props
 */
defineProps({
  /**
   * Current theme ('light' or 'dark')
   */
  theme: {
    type: String,
    required: true
  }
});

/**
 * Define emits for the component
 * toggle-theme: Emitted when theme switch is toggled
 */
defineEmits(['toggle-theme']);

// Get Nuxt app instance to access plugins
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

/**
 * State for tracking open dropdown menus
 * Each index corresponds to a navigation item
 */
const openDropdowns = ref({});

/**
 * Initialize dropdown state for each navigation item
 */
onMounted(() => {
  // Initialize all dropdowns as closed
  menuConfig.header.items.forEach((item, index) => {
    if (item.hasDropdown) {
      openDropdowns.value[index] = false;
    }
  });

  // Add global click handler to close dropdowns when clicking outside
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleOutsideClick);
  }
});

/**
 * Clean up event listeners on component unmount
 */
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleOutsideClick);
  }
});

/**
 * Close dropdowns when clicking outside
 */
const handleOutsideClick = (event) => {
  // Check if click is outside dropdown menus and their activators
  const isOutsideDropdown = !event.target.closest('.v-menu') &&
                           !event.target.closest('.v-btn[aria-haspopup="true"]');

  if (isOutsideDropdown) {
    // Close all dropdowns
    Object.keys(openDropdowns.value).forEach(key => {
      openDropdowns.value[key] = false;
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
    const isInDropdown = activeElement &&
                        (activeElement.closest('.v-menu') ||
                         activeElement.getAttribute('aria-haspopup') === 'true');

    if (!isInDropdown) {
      openDropdowns.value[index] = false;
    }
  }, 100);
};

/**
 * Focus the next item in a dropdown menu
 */
const focusNextDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll('.v-menu')[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll('.v-list-item');
  const nextIndex = currentItemIndex + 1 < items.length ? currentItemIndex + 1 : 0;

  if (items[nextIndex]) {
    items[nextIndex].focus();
  }
};

/**
 * Focus the previous item in a dropdown menu
 */
const focusPrevDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll('.v-menu')[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll('.v-list-item');
  const prevIndex = currentItemIndex - 1 >= 0 ? currentItemIndex - 1 : items.length - 1;

  if (items[prevIndex]) {
    items[prevIndex].focus();
  }
};

/**
 * Handle tab key in dropdown menu to ensure proper focus management
 */
const handleDropdownTabKey = (dropdownIndex, currentItemIndex, totalItems, event) => {
  // If tabbing from the last item, close the dropdown
  if (currentItemIndex === totalItems - 1 && !event.shiftKey) {
    openDropdowns.value[dropdownIndex] = false;
  }
};

/**
 * Handle click on home links
 * If already on homepage, just scroll to top
 * Otherwise navigate to homepage
 */
const handleHomeClick = () => {
  if (route.path === '/') {
    // Already on homepage, just scroll to top
    nuxtApp.$scrollToTop();
  } else {
    // Navigate to homepage
    router.push('/');
  }
};
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: '';
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

/* Dropdown menu styles */
.dropdown-menu {
  border-radius: 4px;
  min-width: 200px;
  max-width: 300px;
  overflow: hidden;
}

.dropdown-item {
  transition: background-color 0.2s ease, color 0.2s ease;
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
</style>