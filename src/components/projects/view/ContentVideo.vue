<script setup>
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import Container from '@/components/ui/Container.vue'
  import ContentVariantWrapper from '@/components/projects/view/ContentVariantWrapper.vue'

  const props = defineProps({
    url: {
      type: String,
      required: true
    },
    mime: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <ContentVariantWrapper :variant="variant">
    <video autoplay muted loop playsinline preload="metadata">
      <source :src="projectAsset(url)" :type="mime">
    </video>
  </ContentVariantWrapper>
</template>

<style scoped>
  video {
    display: block;
    width: 100%;
    margin: min(10rem, 10vh) auto;
  }
</style>