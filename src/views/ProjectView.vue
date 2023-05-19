<script setup>
  import { usePinBody } from '../composables/pinbody.js'
  import Header from '@/components/projects/view/Header.vue'
  import Info from '@/components/projects/view/Info.vue'
  import Content from '@/components/projects/view/Content.vue'

  const props = defineProps({
    ready: {
      type: Boolean,
      required: false
    },
    project: {
      type: Object,
      required: true
    }
  })

  // Not use because instead of doing this on mount/unmount, its in a timeline in HomeView
  // usePinBody()
</script>

<template>
  <div v-if="ready">
    <Header v-bind="project" />
    <Content :content="project.content" />
    
    Ready: {{ ready }}
    <div>
      <router-link class="link" to="/">Retour</router-link>
    </div>
  </div>
</template>

<style scoped>
</style>