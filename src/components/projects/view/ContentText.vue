<script setup>
  import Container from '@/components/ui/Container.vue'

  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <Container>
    <p v-html="content"></p>
  </Container>
</template>

<style scoped>
  p {
    font-size: var(--size-h5);
    margin-bottom: 4rem;
  }
</style>