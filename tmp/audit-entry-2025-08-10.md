### 2025-08-10 (Fix hydration mismatch warnings on mobile nav active state)
- Ensured consistent active-state calculation between SSR and client for mobile navigation items to prevent hydration class mismatches.
- Files modified/created:
  - `app/components/content/AppSidebar.vue`: Added trailing-slash-agnostic isActive() helper and applied :active bindings to home, plan, and more items.
- Technical Notes:
  - Introduced normalizePath() to strip a single trailing slash (excluding root) and compare current route against targets exactly.
  - Applied :active to v-list-item entries so SSR and client compute the same class set.
  - This addresses warnings like "Hydration class mismatch" for class v-list-item--active.

