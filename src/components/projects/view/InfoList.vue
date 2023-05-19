<script setup>
  const props = defineProps({
    items: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </ul>
</template>

<style scoped>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: .6rem;
  }
</style>