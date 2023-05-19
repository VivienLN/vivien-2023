<script setup>
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import Container from '@/components/ui/Container.vue'

  const props = defineProps({
    variant: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="wrapper" :class="`variant-${variant}`">
    <slot></slot>
  </div>
</template>

<style scoped>
  .wrapper {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .variant-full {
    width: 100%;
  }
  .variant-large {
    width: 100%;
    padding: 0 var(--container-padding)
  }
  .variant-container {
    width: var(--container-width);
  }
</style>