<script setup>
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import Container from '@/components/ui/Container.vue'
  import ContentVariantWrapper from '@/components/projects/view/ContentVariantWrapper.vue'

  const props = defineProps({
    url: {
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
    <img :src="projectAsset(url)" />
  </ContentVariantWrapper>
</template>

<style scoped>
  img {
    display: block;
    width: 100%;
    margin: min(10rem, 10vh) auto;
  }
</style>