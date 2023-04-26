<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'

  // ===================================================
  // Here override threeJS parameters
  // ===================================================
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
    <div>
      <button @click="previous">Précédent</button>
      <button @click="next">Suivant</button>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    </div>
    <Projects3d 
      :currentIndex="currentIndex"
      :projects="projects"
      :settings="sceneSettings"
      scrollTriggerElement=".projects"
    />
    <div class="projects">
      <section class="project" v-for="(project, index) in projects" :key="index">
        <div>
          <h2 class="title">{{ project.title }}</h2>
          <p class="subtitle">{{ project.subtitle }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
  button {
    position: relative;
    z-index: 10;
  }
  .projects {
    position: relative;
    z-index: 10;
    pointer-events: none;
  }
  section.project {
    height: 80vh;
    text-align: center;
    /* border: 2px solid red; */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title {
    font-size: 6rem;
  }
  .subtitle {
    text-transform: uppercase;
    font-weight: bold;
  }
</style>