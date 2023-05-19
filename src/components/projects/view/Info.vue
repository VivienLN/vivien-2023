<script setup>
  import InfoList from '@/components/projects/view/InfoList.vue'
  const props = defineProps({
    data: {
      type: Object,
      required: true
    }
  })
</script>

<template>
  <div class="wrapper">
    <div class="info" v-for="info in data" :key="info.title">
      <h2>{{ info.title }}</h2>
      <InfoList :items="info.items" />
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    align-items: top;
    justify-content: space-between;
    gap: 1rem;
  }
  .info {
    
  }
  h2 {
    font-family: var(--title-font);
    font-size: var(--size-h5);
    font-weight: normal;
    margin-bottom: 1rem;
  }
</style>