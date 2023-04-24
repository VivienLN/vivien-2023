<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'

  const sceneSettings = {
    
  }
</script>

<template>
  <main>
    <Projects3d 
      :projects="projects"
      :settings="sceneSettings"
    />
  </main>
</template>
