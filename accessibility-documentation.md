# Accessibility Documentation: Illinois Violent Prevention Project

**Last Updated: May 18, 2025**

The Illinois Violent Prevention Project is committed to ensuring digital accessibility. We aim to meet and exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.

> **Note**: This document is also available as an HTML page at `/accessibility-documentation.html` for direct access without requiring JavaScript.

This document outlines the accessibility features available on our site and provides guidance on how to use them effectively.

## Accessibility Features

### Keyboard Navigation

Our site is fully navigable using only a keyboard:

- **Tab**: Move forward through interactive elements (links, buttons, form controls)
- **Shift+Tab**: Move backward through interactive elements
- **Enter/Return**: Activate the currently focused link or button
- **Space**: Activate buttons, toggle checkboxes and other controls
- **Arrow keys**: Navigate within components like dropdown menus

#### Skip to Content

A "Skip to Content" link appears when you first tab into the page. This allows keyboard users to bypass the navigation menu and go directly to the main content.

### Screen Reader Support

Our site is optimized for screen readers with the following features:

- Semantic HTML structure with proper landmarks (header, main, footer, navigation)
- ARIA attributes to enhance context and meaning
- Descriptive link text and button labels
- Alternative text for all images
- Announcements for dynamic content changes
- Proper heading hierarchy for easy navigation

### Display Customization

#### Theme Toggle

We offer both light and dark themes to accommodate different visual preferences:

- The theme toggle is located in the top navigation bar
- Your preference is remembered between visits
- The toggle is fully keyboard accessible and works with screen readers

#### Responsive Design

Our site adapts to different screen sizes and zoom levels:

- Content reflows appropriately when zoomed up to 400%
- No horizontal scrolling is required at zoom levels up to 400%
- Text remains readable at all viewport sizes

### Additional Accessibility Features

- **High Contrast**: All text meets WCAG 2.1 AAA contrast requirements (8:1 ratio)
- **Focus Indicators**: Visible focus indicators for all interactive elements
- **Reduced Motion**: Respects the `prefers-reduced-motion` setting to minimize animations
- **Text Spacing**: Supports increased text spacing without loss of content
- **Consistent Navigation**: Predictable navigation patterns throughout the site
- **Error Identification**: Clear error messages with suggestions for correction
- **Descriptive Tooltips**: Additional context provided via tooltips on navigation items

## Assistive Technology Compatibility

The Illinois Violent Prevention Project has been tested with the following assistive technologies:

- Screen readers: NVDA, JAWS, VoiceOver
- Browser compatibility: Chrome, Firefox, Safari, Edge
- Mobile screen readers: VoiceOver (iOS), TalkBack (Android)

## Known Limitations

While we strive for perfect accessibility, we are continuously improving. Current known limitations include:

- Complex data visualizations may have limited screen reader support
- Some third-party embedded content may not meet all accessibility standards

## Accessibility Statement

We are committed to ensuring our website is accessible to all users regardless of ability or technology. Our development process includes:

- Regular accessibility audits
- User testing with people who use assistive technologies
- Continuous improvement based on feedback and best practices

## Feedback and Assistance

We welcome your feedback on the accessibility of the Illinois Violent Prevention Project. Please let us know if you encounter any accessibility barriers:

- Email: [accessibility@icjia.illinois.gov](mailto:accessibility@icjia.illinois.gov)
- Phone: (555) 123-4567

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Illinois Information Technology Accessibility Act](https://www.dhs.state.il.us/page.aspx?item=32765)
- [Accessibility Basics](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

## Compatibility with Assistive Technologies

The Illinois Violent Prevention Project is designed to be compatible with the following assistive technologies:

### Screen Readers
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Input Devices
- Keyboard only navigation
- Voice recognition software
- Switch controls
- Eye tracking devices

### Browsers
- Google Chrome with accessibility extensions
- Mozilla Firefox with accessibility extensions
- Safari with VoiceOver
- Microsoft Edge with Narrator

## Accessibility Features by Page

### Homepage
- Skip to content link
- Keyboard-navigable feature cards
- Screen reader announcements for dynamic content
- Proper heading structure (h1 → h2 → h3)

### About Page
- Keyboard-navigable value cards
- Accessible approach section with proper ARIA attributes
- Contact button with descriptive labels
- Proper focus management

## Technical Compliance

The Illinois Violent Prevention Project meets the following technical requirements:

- Valid HTML5 according to W3C standards
- Proper use of ARIA landmarks and attributes
- Semantic HTML elements throughout
- Keyboard focus visible and logical
- Color contrast ratio of 8:1 or higher for all text
- Text resizable up to 200% without loss of content
- No time-based media that auto-plays
- No content that flashes more than three times per second
