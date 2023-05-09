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
  import { ScrollToPlugin } from "gsap/ScrollToPlugin"
  gsap.registerPlugin(ScrollToPlugin)
  import { CustomEase } from "gsap/CustomEase"
  gsap.registerPlugin(CustomEase)

  // Props
  const props = defineProps({
    projects: {
      type: Array,
      required: true
    },
    activeProject: {
      type: Number,
      required: false,
    },
    settings: {
      type: Object,
      required: false
    },
    currentIndex: {
      type: Number,
      required: true
    },
    scrollTriggerElement: {
      type:String,
      required: true
    }
  })
  
  // Ref for canvas
  const threeCanvas = ref(null)

  // 3D scene
  const projectsScene = new ProjectsScene(props.settings)

  // Resize
  const sizes = useResize(threeCanvas, projectsScene.resize.bind(projectsScene))
  const mousePosition = useMousePosition(projectsScene.handleParallax.bind(projectsScene))

  // Mounted: init scene
  onMounted(async () => {
    projectsScene.init(props.projects, threeCanvas.value, props.scrollTriggerElement)
  })
  
  // Watch activeproject
  watch(() => props.activeProject, projectsScene.onActiveProjectChange.bind(projectsScene))

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