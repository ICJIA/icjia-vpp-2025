<template>
  <section class="section py-16">
    <v-container>
      <div class="text-center mb-16">
        <h2 class="text-h3 font-weight-bold mb-4">Sit virtus enim</h2>
        <p class="text-body-1 mx-auto" style="max-width: 600px;">
          Ipsum caelum bellum homo pax amet.
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
    title: 'Ipsum Caelum Bellum',
    description: 'Elit nox virtus caelum Lorem amet ipsum.'
  },
  {
    icon: 'mdi-responsive',
    title: 'Carmen umbra stella vox',
    description: 'Elit nox virtus caelum.'
  },
  {
    icon: 'mdi-lightning-bolt-outline',
    title: 'Vox tempus elit sol vox',
    description: 'Orbus amet summo bellum est umbra vox.'
  },
  {
    icon: 'mdi-theme-light-dark',
    title: 'Vita idem bis aether lumen',
    description: 'Caelum orbus opus sanctum amet.'
  },
  {
    icon: 'mdi-cube-scan',
    title: 'Rex adipiscing bis umbra',
    description: 'Caligine tempus pax est fassaque.'
  },
  {
    icon: 'mdi-animation-outline',
    title: 'Stella vox terra carmen anima rex',
    description: 'Anima Lorem opus fine vox manus opus elit lumen opus stella portitor bellum aether nox. Fassaque consectetur.'
  }
];
</script>