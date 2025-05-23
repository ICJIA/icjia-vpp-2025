<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Text Wrap Image Demo</h1>
        
        <v-card class="mb-6">
          <v-card-title>Left-aligned Image Example</v-card-title>
          <v-card-text>
            <TextWrapImage
              src="/illinois_seal_original.png"
              alt="Illinois State Seal"
              width="250"
              height="250"
              align="left"
              spacing="medium"
              caption="Illinois State Seal"
            >
              <p>
                This is an example of text wrapping around a left-aligned image with medium spacing.
                The text will flow to the right of the image and continue below it once it reaches
                the bottom of the image.
              </p>
              
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
                nisl nunc quis nisl.
              </p>
              
              <p>
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
                nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet
                nunc, quis aliquam nisl nunc quis nisl.
              </p>
            </TextWrapImage>
          </v-card-text>
        </v-card>
        
        <v-card class="mb-6">
          <v-card-title>Right-aligned Image Example</v-card-title>
          <v-card-text>
            <TextWrapImage
              src="/illinois_seal_original.png"
              alt="Illinois State Seal"
              width="250"
              height="250"
              align="right"
              spacing="large"
              caption="Illinois State Seal (Right Aligned)"
            >
              <p>
                This is an example of text wrapping around a right-aligned image with large spacing.
                The text will flow to the left of the image and continue below it once it reaches
                the bottom of the image.
              </p>
              
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
                nisl nunc quis nisl.
              </p>
              
              <p>
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
                nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet
                nunc, quis aliquam nisl nunc quis nisl.
              </p>
            </TextWrapImage>
          </v-card-text>
        </v-card>
        
        <v-card>
          <v-card-title>Different Spacing Options</v-card-title>
          <v-card-text>
            <h3 class="text-h5 mb-4">Small Spacing</h3>
            <TextWrapImage
              src="/illinois_seal_original.png"
              alt="Illinois State Seal"
              width="200"
              height="200"
              align="left"
              spacing="small"
              caption="Small spacing"
            >
              <p>
                This example demonstrates small spacing between the image and text.
                Notice how the text is closer to the image compared to the medium spacing example.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                aliquam ultricies, nunc nisl aliquet nunc.
              </p>
            </TextWrapImage>
            
            <div class="mt-12 pt-6">
              <h3 class="text-h5 mb-4">XLarge Spacing</h3>
              <TextWrapImage
                src="/illinois_seal_original.png"
                alt="Illinois State Seal"
                width="200"
                height="200"
                align="right"
                spacing="xlarge"
                caption="XLarge spacing"
              >
                <p>
                  This example demonstrates extra large spacing between the image and text.
                  Notice how the text has more distance from the image compared to the other examples.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                  aliquam ultricies, nunc nisl aliquet nunc.
                </p>
              </TextWrapImage>
            </div>
          </v-card-text>
        </v-card>
        
        <div class="mt-6">
          <h2 class="text-h4 mb-4">Usage in Markdown</h2>
          <p>
            To use this component in markdown files, you can embed it directly using the following syntax:
          </p>
          <v-card class="pa-4 mb-6">
            <pre><code>&lt;TextWrapImage
  src="/illinois_seal_original.png"
  alt="Illinois State Seal"
  width="250"
  height="250"
  align="left"
  spacing="medium"
  caption="Illinois State Seal"
&gt;

Your markdown content goes here. This text will wrap around the image
based on the alignment setting.

&lt;/TextWrapImage&gt;</code></pre>
          </v-card>
          
          <p>
            For more detailed documentation, see the <a href="/docs/text-wrap-image.md">Text Wrap Image documentation</a>.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/**
 * Text Wrap Image Demo Page
 * 
 * This page demonstrates the TextWrapImage component in various configurations
 * and provides usage examples for both Vue templates and markdown files.
 */
import TextWrapImage from '~/components/content/TextWrapImage.vue';

// Set page metadata
useHead({
  title: 'Text Wrap Image Demo',
  meta: [
    { name: 'description', content: 'Demonstration of text wrapping around images in Vue and Markdown' }
  ]
});
</script>

<style scoped>
pre {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
