# Removed Home Menu Item Documentation

## Date Removed
2025-07-31

## Location
The 'Home' menu item was removed from `config/menu.config.json` in the `header.items` array.

## Original Configuration
```json
{
  "text": "Home",
  "to": "/",
  "ariaLabel": "Go to homepage",
  "variant": "text",
  "color": "on-app-bar",
  "class": "font-weight-bold mx-2 nav-link",
  "mobileClass": "font-weight-bold py-2 nav-link-mobile",
  "displayMode": "both",
  "order": 20
}
```

## Position in Menu
- **Order**: 20 (between "Read the Plan" with order 30 and "Download" with order 40)
- **Array Index**: Was the second item in the `header.items` array (index 1)
- **Location**: Between lines 35-45 in the original file

## To Restore
1. Open `config/menu.config.json`
2. Add the above JSON object to the `header.items` array
3. Place it after the "Read the Plan" item and before the "Download" item
4. Ensure proper JSON formatting with commas
5. Delete this documentation file

## Notes
- This affected both desktop navigation and mobile sidebar
- The Home link functionality is still available through the site branding/logo
