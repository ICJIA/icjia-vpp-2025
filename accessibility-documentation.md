# Accessibility Documentation: Violence Prevention Plan for Illinois: 2025-2029

**Last Updated: May 24, 2025**

> **Documentation Update**: We've conducted our comprehensive accessibility assessment and the site continues to maintain excellent WCAG 2.1 AA compliance. We've enhanced our tooltip accessibility with the AccessibleTooltip component, improved screen reader announcements with the useAnnouncer composable, and added better documentation access with the useAccessibilityDocs composable. These enhancements further strengthen our commitment to providing an accessible experience for all users.

The Violence Prevention Plan for Illinois: 2025-2029 is committed to ensuring digital accessibility. We aim to meet and exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, which is our primary compliance target.

> **Note**: This document is also available as an HTML page on our website for direct access without requiring JavaScript.

## Development Approach

**Important Note**: Accessibility has been integrated into this project from day 1 as a critical, non-negotiable requirement rather than an afterthought. Our development methodology treats accessibility as an integral part of the development process, not as a separate concern. Every component, feature, and UI element is designed and implemented with accessibility in mind from the initial conception through final implementation. This approach ensures that accessibility considerations are baked into the project's foundation and maintained throughout the iterative development process.

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

- **High Contrast**: All text meets WCAG 2.1 AA contrast requirements (4.5:1 ratio minimum), with many elements exceeding this to approach AAA levels (7:1 ratio) where possible
- **Focus Indicators**: Visible focus indicators for all interactive elements that match hover states for consistency
- **Reduced Motion**: Respects the `prefers-reduced-motion` setting to minimize animations through CSS media queries
- **Text Spacing**: Supports increased text spacing without loss of content or functionality
- **Consistent Navigation**: Predictable navigation patterns throughout the site with clear visual and semantic structure
- **Error Identification**: Clear error messages with suggestions for correction and proper ARIA attributes
- **Descriptive Tooltips**: Additional context provided via tooltips with auto-dismiss functionality on mobile devices
- **Screen Reader Announcements**: Dynamic content changes are announced to screen readers using ARIA live regions
- **Semantic Structure**: Proper use of HTML5 semantic elements and ARIA landmarks throughout the site
- **Accessible Images**: All images have appropriate alt text, loading states, and proper ARIA attributes

## Assistive Technology Compatibility

Our website has been tested with the following assistive technologies:

- Screen readers: NVDA, JAWS, VoiceOver
- Browser compatibility: Chrome, Firefox, Safari, Edge
- Mobile screen readers: VoiceOver (iOS), TalkBack (Android)

## Specialized Accessibility Components

Our site includes several specialized components designed specifically to enhance accessibility:

### AccessibleTooltip Component

Our custom AccessibleTooltip component enhances the standard tooltip functionality with:

- Proper ARIA attributes (`role="tooltip"` and `aria-label`)
- Auto-dismiss functionality on mobile devices (after 4 seconds)
- Consistent behavior across the application
- Full keyboard accessibility
- Responsive behavior that adapts to different device types

### Screen Reader Announcer

We use a dedicated screen reader announcement system that:

- Provides both polite and assertive announcement modes
- Properly clears previous announcements to ensure screen readers detect changes
- Announces dynamic content changes that might otherwise be missed
- Uses ARIA live regions with appropriate attributes

## Known Limitations

While we strive for perfect accessibility, we are continuously improving. Current known limitations include:

- Complex data visualizations may have limited screen reader support
- Some third-party embedded content may not meet all accessibility standards
- Automated accessibility testing is still being implemented

## Accessibility Statement

We are committed to ensuring our website is accessible to all users regardless of ability or technology. Our development process includes:

- Regular accessibility audits
- User testing with people who use assistive technologies
- Continuous improvement based on feedback and best practices

## Feedback and Assistance

We welcome your feedback on the accessibility of the Violence Prevention Plan for Illinois: 2025-2029. Please let us know if you encounter any accessibility barriers:

- Email: Contact us through our website's contact form
- Phone: See our contact page for current phone numbers

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Illinois Information Technology Accessibility Act](https://www.dhs.state.il.us/page.aspx?item=32765)
- [Accessibility Basics](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

## Compatibility with Assistive Technologies

Our website is designed to be compatible with the following assistive technologies:

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

Our website meets the following technical requirements:

- Valid HTML5 according to W3C standards
- Proper use of ARIA landmarks and attributes
- Semantic HTML elements throughout
- Keyboard focus visible and logical with focus states that match hover states
- Color contrast ratio of at least 4.5:1 for all text (meeting WCAG AA requirements), with many elements exceeding 7:1
- Text resizable up to 200% without loss of content or functionality
- Content reflows appropriately when zoomed up to 400%
- No time-based media that auto-plays
- No content that flashes more than three times per second
- Proper heading hierarchy (h1 → h2 → h3) throughout the site
- Skip-to-content functionality for keyboard users
- Proper form labels and error messages
- Consistent navigation and predictable behavior
- Proper use of ARIA live regions for dynamic content
- Support for assistive technologies including screen readers and switch controls
