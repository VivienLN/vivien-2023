<script setup>
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import Container from '@/components/ui/Container.vue'
  import Info from '@/components/projects/view/Info.vue'
  import Title from '@/components/projects/Title.vue'
  import Subtitle from '@/components/projects/Subtitle.vue'

  const props = defineProps({
    banner: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    info: {
      type: Array,
      required: false
    },
  })
</script>

<template>
  <header>
    <img class="banner" :src="projectAsset(banner)" />
    <Container>
      <Title>{{ title }}</Title>
      <Subtitle class="subtitle">{{ subtitle }}</Subtitle>
      <Info :data="info" v-if="info" />
    </Container>
  </header>
</template>

<style scoped>
  header {
    margin-bottom: min(14rem, 14vh);
  }

  .banner {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: min(10rem, 10vh);
  }

  .subtitle {
    margin-bottom: min(8rem, 8vh);
  }

</style>