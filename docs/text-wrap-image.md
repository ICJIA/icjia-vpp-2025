# Text Wrap Image Component

This documentation explains how to use the `TextWrapImage` component to create text that wraps around images in your markdown content.

## Overview

The `TextWrapImage` component allows you to embed images within your markdown content with text wrapping around them. This creates a more visually appealing layout compared to standard markdown images that break the flow of text.

## Installation

The component is already installed in the project at:

```
components/content/TextWrapImage.vue
```

## Usage in Markdown Files

You can use the component directly in your markdown files by embedding it as a Vue component:

```md
<TextWrapImage
src="/path/to/image.jpg"
alt="Descriptive alt text"
width="250"
height="250"
align="left"
spacing="medium"
caption="Optional image caption"

>

Your markdown content goes here. This text will wrap around the image
based on the alignment setting. You can include any markdown formatting
within this content, including **bold text**, _italic text_, lists, and more.

Multiple paragraphs are supported as well. Just make sure to maintain proper
spacing in your markdown.

</TextWrapImage>
```

## Props

The component accepts the following props:

| Prop           | Type          | Default        | Description                                                               |
| -------------- | ------------- | -------------- | ------------------------------------------------------------------------- |
| `src`          | String        | (required)     | Source URL for the image                                                  |
| `alt`          | String        | (required)     | Alternative text for the image (required for accessibility)               |
| `width`        | Number/String | 250            | Width of the image in pixels                                              |
| `height`       | Number/String | 250            | Height of the image in pixels                                             |
| `align`        | String        | 'left'         | Alignment of the image ('left' or 'right')                                |
| `spacing`      | String        | 'medium'       | Spacing between the image and text ('small', 'medium', 'large', 'xlarge') |
| `caption`      | String        | ''             | Optional caption for the image                                            |
| `captionClass` | String        | 'text-caption' | CSS class for the caption                                                 |
| `spinnerColor` | String        | 'primary'      | Color of the loading spinner                                              |
| `eager`        | Boolean       | true           | Whether to load the image eagerly                                         |
| `cover`        | Boolean       | false          | Whether the image should cover its container                              |

## Examples

### Left-aligned Image with Medium Spacing

```md
<TextWrapImage
src="/illinois_seal_original.png"
alt="Illinois State Seal"
width="250"
height="250"
align="left"
spacing="medium"
caption="Illinois State Seal"

>

This is an example of text wrapping around a left-aligned image with medium spacing.
The text will flow to the right of the image and continue below it once it reaches
the bottom of the image.

</TextWrapImage>
```

### Right-aligned Image with Large Spacing

```md
<TextWrapImage
src="/illinois_seal_original.png"
alt="Illinois State Seal"
width="250"
height="250"
align="right"
spacing="large"
caption="Illinois State Seal"

>

This is an example of text wrapping around a right-aligned image with large spacing.
The text will flow to the left of the image and continue below it once it reaches
the bottom of the image.

</TextWrapImage>
```

## Accessibility Considerations

- Always provide meaningful `alt` text for images
- The component includes proper ARIA attributes for loading states
- The image caption is styled to maintain proper contrast in both light and dark themes
- On mobile devices, the image will stack above the content for better readability

## Responsive Behavior

The component is fully responsive:

- On desktop and tablet, the image floats with text wrapping around it
- On mobile devices (below 600px width), the image centers above the text to ensure readability

## Theme Compatibility

The component is designed to work seamlessly in both light and dark themes:

- Image captions use theme variables to maintain proper contrast
- Border and background colors adapt to the current theme
