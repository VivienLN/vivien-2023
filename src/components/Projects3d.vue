<script setup>
  import ProjectsScene from '../three/projects/ProjectsScene.js'

  // VueJS imports
  import { onMounted, onBeforeUpdate, ref, watch } from 'vue'
  import { useResize } from '../composables/resize.js'
  import { useMousePosition } from '../composables/mouseposition.js'
  
  // GSAP imports
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  gsap.registerPlugin(ScrollTrigger)


  // ===================================================
  // Here override threeJS parameters
  // ===================================================

  const sceneSettings = {
    enableGui: true,
    enableOrbit: false,
    enableAxesHelper: false,    
  }


  // ===================================================
  // Props
  // ===================================================

  const props = defineProps({
    projects: {
      type: Array,
      required: true
    },
    activeProject: {
      type: String,
      required: false,
    },
    scrollTrigger: {
      type:Object,
      required: false
    }
  })


  // ===================================================
  // Refs
  // ===================================================

  const threeCanvas = ref(null)
  

  // ===================================================
  // ThreeJS scene and events
  // ===================================================

  // 3D scene
  const projectsScene = new ProjectsScene(sceneSettings)

  // Resize
  const sizes = useResize(threeCanvas, projectsScene.resize.bind(projectsScene))
  const mousePosition = useMousePosition(projectsScene.handleParallax.bind(projectsScene))


  // ===================================================
  // Vue hooks and watchers
  // ===================================================

  // Init scene
  onMounted(async () => {
    projectsScene.init(props.projects, threeCanvas.value, props.scrollTrigger)
  })
  
  // Watch active project slug
  watch(() => props.activeProject, (newValue, oldValue) => {
    projectsScene.setActiveProject(newValue, oldValue)
  })

</script>

<template>
  <canvas ref="threeCanvas"></canvas>
</template>

<style scoped>
  canvas {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
  h1 { position: fixed; }
</style>