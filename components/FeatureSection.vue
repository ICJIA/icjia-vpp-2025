<template>
  <section class="section py-16">
    <v-container>
      <div class="text-center mb-16">
        <h2 class="text-h3 font-weight-bold mb-4">Key Features</h2>
        <p class="text-body-1 mx-auto" style="max-width: 600px;">
          Discover what makes this application stand out with its carefully crafted features.
        </p>
      </div>
      
      <v-row>
        <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4" class="mb-8">
          <FeatureCard 
            :icon="feature.icon" 
            :title="feature.title" 
            :description="feature.description"
            :delay="index * 0.2"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'mdi-palette-outline',
    title: 'Beautiful Design',
    description: 'Carefully crafted interface with attention to detail and aesthetic appeal.'
  },
  {
    icon: 'mdi-responsive',
    title: 'Fully Responsive',
    description: 'Optimized for all devices and screen sizes from mobile to desktop.'
  },
  {
    icon: 'mdi-lightning-bolt-outline',
    title: 'High Performance',
    description: 'Lightning-fast load times and smooth interactions throughout the application.'
  },
  {
    icon: 'mdi-theme-light-dark',
    title: 'Dark/Light Mode',
    description: 'Switch between beautiful color schemes based on your preference.'
  },
  {
    icon: 'mdi-cube-scan',
    title: 'Static Generation',
    description: 'Pre-rendered pages for better performance and SEO optimization.'
  },
  {
    icon: 'mdi-animation-outline',
    title: 'Smooth Animations',
    description: 'Subtle, meaningful animations enhance the user experience.'
  }
];
</script>