# Site Navigation Configuration

This document provides documentation for the `menu.config.json` file that defines the navigation structure for both the header and footer components in the Violence Prevention Plan for Illinois: 2025-2029 application.

## Overview

The `menu.config.json` file provides a centralized place to manage all navigation items across the application. This configuration-based approach allows developers to easily modify the site's navigation structure without editing component code.

## File Structure

The configuration file is structured as follows:

```json
{
  "header": {
    "branding": { ... },
    "items": [ ... ]
  },
  "footer": {
    "branding": { ... },
    "description": "...",
    "sections": [ ... ],
    "copyright": "..."
  }
}
```

## Header Configuration

### Branding Properties

The `header.branding` object defines the site logo and title in the header:

| Property    | Type   | Description                                          |
| ----------- | ------ | ---------------------------------------------------- |
| `icon`      | String | Material Design icon name (e.g., "mdi-cube-outline") |
| `text`      | String | Full title text for extra-large screens              |
| `textMd`    | String | Title text for large screens                         |
| `textSm`    | String | Title text for medium screens                        |
| `textXs`    | String | Title text for small screens                         |
| `href`      | String | URL for the logo/title link                          |
| `ariaLabel` | String | Accessible label for screen readers                  |
| `tooltip`   | String | Text displayed in the tooltip                        |

### Navigation Items Properties

Each item in the `header.items` array can have the following properties:

| Property             | Type    | Description                                                                                            |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `text`               | String  | Display text for the navigation item                                                                   |
| `to`                 | String  | Vue Router path for internal links (use for routes within the application)                             |
| `href`               | String  | URL for links (use for both internal non-router links and external links)                              |
| `ariaLabel`          | String  | Accessible label for screen readers                                                                    |
| `tooltip`            | String  | Text displayed in the tooltip                                                                          |
| `tooltipLocation`    | String  | Position of the tooltip (top, bottom, left, right)                                                     |
| `variant`            | String  | Button variant (text, outlined, etc.)                                                                  |
| `color`              | String  | Button color (primary, etc.)                                                                           |
| `class`              | String  | Additional CSS classes for desktop view                                                                |
| `mobileClass`        | String  | Additional CSS classes for mobile view                                                                 |
| `displayMode`        | String  | Where to display the item: 'desktop', 'mobile', or 'both'                                              |
| `hasDropdown`        | Boolean | Set to `true` for items that have dropdown menus                                                       |
| `dropdownIcon`       | String  | Material Design icon to display next to dropdown menu items in desktop view (e.g., "mdi-chevron-down") |
| `mobileDropdownIcon` | String  | Material Design icon to display next to dropdown menu items in mobile view (e.g., "mdi-chevron-right") |
| `children`           | Array   | Array of child items for dropdowns (same properties as parent)                                         |
| `isExternal`         | Boolean | Set to `true` for external links (links to other websites)                                             |
| `target`             | String  | Target attribute for links (e.g., "\_blank" to open in new tab)                                        |
| `rel`                | String  | Rel attribute for links (e.g., "noopener noreferrer" for security)                                     |
| `externalIcon`       | String  | Material Design icon to display next to external links (e.g., "mdi-open-in-new")                       |
| `order`              | Number  | Position in the navigation menu (lower numbers appear first)                                           |
| `iconOnly`           | Boolean | Whether to display only the icon without text                                                          |
| `icon`               | String  | Material Design icon name for icon-only items                                                          |

### Internal vs External Links

The navigation system distinguishes between internal and external links:

1. **Internal Router Links**: Use the `to` property for links to routes within the Vue application.

   ```json
   {
     "text": "About",
     "to": "/about",
     "ariaLabel": "Learn more about our project"
   }
   ```

2. **Internal Non-Router Links**: Use the `href` property for links to static files or pages within the same domain.

   ```json
   {
     "text": "External PDF",
     "href": "/files/document.pdf",
     "ariaLabel": "Download PDF document"
   }
   ```

3. **External Links**: Use the `href` property with additional attributes for links to external websites.
   ```json
   {
     "text": "ICJIA Website",
     "href": "https://icjia.illinois.gov",
     "ariaLabel": "Visit the Illinois Criminal Justice Information Authority website",
     "isExternal": true,
     "target": "_blank",
     "rel": "noopener noreferrer",
     "externalIcon": "mdi-open-in-new"
   }
   ```

### Security Considerations for External Links

When adding external links, always include these security attributes:

1. **target="\_blank"**: Opens the link in a new tab, preserving the user's session in your application.

2. **rel="noopener noreferrer"**: Prevents the new page from accessing the `window.opener` property and redirecting your page to a malicious URL (noopener), and prevents passing the referrer information to the new page (noreferrer).

3. **Visual Indicator**: Always include an icon (using the `externalIcon` property) to visually indicate that the link will take users to an external site.

### Responsive Navigation

The navigation system supports responsive behavior with different layouts for desktop and mobile views:

1. **Desktop View (md and up)**: Displays a horizontal navigation bar with dropdown menus
2. **Mobile View (sm and down)**: Displays a hamburger menu that opens a slide-out drawer

To configure responsive behavior:

1. Use the `displayMode` property to control where items appear:

   - `"desktop"`: Item only appears in desktop navigation
   - `"mobile"`: Item only appears in mobile navigation
   - `"both"`: Item appears in both desktop and mobile navigation (default)

2. Use different styling for desktop and mobile:

   - `class`: CSS classes for desktop view
   - `mobileClass`: CSS classes for mobile view

3. Configure mobile-specific properties:
   - `mobileDropdownIcon`: Icon for dropdown indicators in mobile view

The mobile navigation implementation includes:

- **Slide-out Drawer**: A right-side drawer that appears when the hamburger icon is clicked
- **Expandable Dropdowns**: Dropdown menus that expand/collapse within the drawer
- **Consistent Styling**: Visual indicators and styling consistent with desktop view
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Theme Toggle**: Theme switch included in the mobile menu

### Dropdown Menus

Dropdown menus allow for hierarchical navigation structures. To create a dropdown menu:

1. Set `hasDropdown: true` on the parent navigation item
2. Add a `dropdownIcon` (typically "mdi-chevron-down") for desktop view
3. Add a `mobileDropdownIcon` (typically "mdi-chevron-right") for mobile view
4. Define an array of `children` items, each with their own properties

The dropdown implementation includes:

- **Hover and Click Support**: Menus open on hover for desktop and on click for mobile/keyboard
- **Keyboard Navigation**: Full keyboard support with arrow keys for navigation
- **Focus Management**: Proper focus trapping within the dropdown menu
- **Accessibility**: ARIA attributes for screen readers (aria-haspopup, aria-expanded)
- **Visual Indicators**: Icons and styling to indicate dropdown functionality

Example dropdown configuration:

````json
{
  "text": "Projects",
  "ariaLabel": "Browse our projects",
  "tooltip": "Browse our violence prevention projects",
  "tooltipLocation": "bottom",
  "variant": "text",
  "color": "on-app-bar",
  "class": "font-weight-medium mx-2 nav-link",
  "mobileClass": "font-weight-medium py-2 nav-link-mobile",
  "displayMode": "both",
  "hasDropdown": true,
  "dropdownIcon": "mdi-chevron-down",
  "mobileDropdownIcon": "mdi-chevron-right",
  "children": [
    {
      "text": "Youth Intervention",
      "to": "/projects/youth-intervention",
      "ariaLabel": "Learn about youth intervention projects",
      "tooltip": "Learn about youth intervention projects",
      "tooltipLocation": "right",
      "class": "dropdown-item",
      "mobileClass": "dropdown-item-mobile ml-4",
      "color": "on-app-bar",
      "displayMode": "both"
    },
    {
      "text": "CDC Violence Prevention",
      "href": "https://www.cdc.gov/violenceprevention/",
      "ariaLabel": "Visit CDC Violence Prevention website",
      "tooltip": "Visit CDC Violence Prevention website",
      "tooltipLocation": "right",
      "class": "dropdown-item",
      "mobileClass": "dropdown-item-mobile ml-4",
      "color": "on-app-bar",
      "isExternal": true,
      "target": "_blank",
      "rel": "noopener noreferrer",
      "externalIcon": "mdi-open-in-new",
      "displayMode": "both"
    }
  ]
}

## Footer Configuration

### Branding Properties

The `footer.branding` object has the same properties as `header.branding`.

### Footer Description

The `footer.description` is a string that appears below the branding in the footer.

### Footer Sections

The `footer.sections` array contains objects that define the different sections in the footer:

| Property | Type | Description |
|----------|------|-------------|
| `title` | String | Section title |
| `items` | Array | Array of navigation items in this section |

Each item in a section's `items` array can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `text` | String | Display text for the navigation item |
| `to` | String | Vue Router path for internal links (use for routes within the application) |
| `href` | String | URL for links (use for both internal non-router links and external links) |
| `ariaLabel` | String | Accessible label for screen readers |
| `tooltip` | String | Text displayed in the tooltip |
| `tooltipLocation` | String | Position of the tooltip (top, bottom, left, right) |
| `class` | String | Additional CSS classes |
| `isExternal` | Boolean | Set to `true` for external links (links to other websites) |
| `target` | String | Target attribute for links (e.g., "_blank" to open in new tab) |
| `rel` | String | Rel attribute for links (e.g., "noopener noreferrer" for security) |
| `externalIcon` | String | Material Design icon to display next to external links (e.g., "mdi-open-in-new") |

### Copyright

The `footer.copyright` string defines the copyright text in the footer. Use `{year}` as a placeholder for the current year.

## Usage Examples

### Adding a New Internal Header Item

To add a new internal navigation item to the header:

```json
{
  "text": "New Page",
  "to": "/new-page",
  "ariaLabel": "Navigate to new page",
  "tooltip": "Visit our new page",
  "tooltipLocation": "bottom",
  "variant": "text",
  "color": "on-app-bar",
  "class": "font-weight-medium mx-2 nav-link"
}
````

### Adding an External Header Item

To add an external link to the header:

```json
{
  "text": "Partner Website",
  "href": "https://example.org",
  "ariaLabel": "Visit our partner website",
  "tooltip": "Visit our partner website",
  "tooltipLocation": "bottom",
  "variant": "text",
  "color": "on-app-bar",
  "class": "font-weight-medium mx-2 nav-link",
  "isExternal": true,
  "target": "_blank",
  "rel": "noopener noreferrer",
  "externalIcon": "mdi-open-in-new"
}
```

### Adding a Dropdown Menu

To add a dropdown menu with child items:

```json
{
  "text": "Resources",
  "ariaLabel": "Resources dropdown",
  "tooltip": "View our resources",
  "tooltipLocation": "bottom",
  "variant": "text",
  "color": "on-app-bar",
  "class": "font-weight-medium mx-2 nav-link",
  "hasDropdown": true,
  "dropdownIcon": "mdi-chevron-down",
  "children": [
    {
      "text": "Resource 1",
      "to": "/resources/1",
      "ariaLabel": "View resource 1",
      "tooltip": "View resource 1",
      "tooltipLocation": "right",
      "class": "dropdown-item",
      "color": "on-app-bar"
    },
    {
      "text": "Resource 2",
      "to": "/resources/2",
      "ariaLabel": "View resource 2",
      "tooltip": "View resource 2",
      "tooltipLocation": "right",
      "class": "dropdown-item",
      "color": "on-app-bar"
    },
    {
      "text": "External Resource",
      "href": "https://example.org/resources",
      "ariaLabel": "View external resources",
      "tooltip": "View external resources",
      "tooltipLocation": "right",
      "class": "dropdown-item",
      "color": "on-app-bar",
      "isExternal": true,
      "target": "_blank",
      "rel": "noopener noreferrer",
      "externalIcon": "mdi-open-in-new"
    }
  ]
}
```

### Adding a New Footer Section

To add a new section to the footer:

```json
{
  "title": "New Section",
  "items": [
    {
      "text": "Internal Link",
      "to": "/internal-page",
      "ariaLabel": "View internal page",
      "tooltip": "View internal page",
      "tooltipLocation": "top",
      "class": "footer-link mb-2"
    },
    {
      "text": "External Link",
      "href": "https://example.org",
      "ariaLabel": "Visit example.org",
      "tooltip": "Visit example.org",
      "tooltipLocation": "top",
      "class": "footer-link mb-2",
      "isExternal": true,
      "target": "_blank",
      "rel": "noopener noreferrer",
      "externalIcon": "mdi-open-in-new"
    }
  ]
}
```

## Best Practices

1. Always provide `ariaLabel` and `tooltip` properties for accessibility
2. Use `to` for internal Vue router links and `href` for external links or static files
3. For external links:
   - Always set `isExternal: true`
   - Always include `target: "_blank"` to open in a new tab
   - Always include `rel: "noopener noreferrer"` for security
   - Always include an icon with `externalIcon` to visually indicate external links
4. For dropdown menus:
   - Always set `hasDropdown: true` on parent items
   - Always include a `dropdownIcon` to visually indicate dropdown functionality
   - Limit dropdown depth to one level for better usability
   - Keep dropdown items concise and limited to 5-7 items when possible
5. For navigation item ordering:
   - Always include an `order` property to control item position
   - Use increments of 10 (10, 20, 30...) to allow for future insertions
   - Standard navigation items should have lower order values (10-80)
   - Icon-only utility items should have higher order values (90+)
   - Items without an order property will appear at the end
   - Ensure dropdown items have consistent styling using the `dropdown-item` class
   - Include a mix of internal and external links as needed, following the same guidelines
6. For responsive navigation:
   - Always set `displayMode` for all navigation items (default is "both")
   - Always provide both `class` and `mobileClass` for consistent styling
   - Use `mobileDropdownIcon` for dropdown menus in mobile view
   - Test navigation on both desktop and mobile screen sizes
   - Ensure mobile drawer opens and closes properly
   - Verify that dropdown menus expand/collapse correctly in mobile view
7. Maintain consistent styling by using the same classes for similar items
8. Keep the navigation structure simple and intuitive
9. Test navigation changes on different screen sizes to ensure responsive behavior
10. Verify that all external links work correctly and open in new tabs
11. Test keyboard navigation for dropdown menus to ensure accessibility
12. Ensure that all links have appropriate ARIA labels for screen readers
13. Verify that the theme toggle works correctly in both desktop and mobile views

## Related Documentation

- **[Site Configuration](./site.config.md)**: General site configuration and metadata
- **[Routes Configuration](./routes.config.md)**: Page discovery and routing metadata
- **[Search Configuration](./fuse.config.md)**: Search functionality and content indexing
- **[Sitemap Configuration](../docs/sitemap.config.md)**: XML sitemap generation and SEO optimization

_Last Updated: May 25, 2025_
