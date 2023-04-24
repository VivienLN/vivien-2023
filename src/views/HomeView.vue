<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'

  const sceneSettings = {
    enableGui: true,
    enableOrbit: false,
    enableAxesHelper: !false,    
  }


  // ===================================================
  // Navigation functions
  // ===================================================
  
  const currentIndex = ref(0)

  function previous() {
    currentIndex.value = getPreviousIndex()
  }

  function next() {
    currentIndex.value = getNextIndex()
  }

  function getPreviousIndex() {
    let target = currentIndex.value - 1
    return target < 0 ? projects.length - 1 : target
  }

  function getNextIndex() {
    let target = currentIndex.value + 1
    return target > projects.length - 1 ? 0 : target
  }

</script>

<template>
  <main>
    <button @click="previous">Précédent</button>
    <button @click="next">Suivant</button>
    <Projects3d 
      :currentIndex="currentIndex"
      :projects="projects"
      :settings="sceneSettings"
    />
  </main>
</template>

<style scoped>
  button {
    position: relative;
    z-index: 10;
  }
</style>