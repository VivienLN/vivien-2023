<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import ProjectSlide from '@/components/projects/ProjectSlide.vue'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'
  
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  gsap.registerPlugin(ScrollTrigger)
  import { ScrollToPlugin } from "gsap/ScrollToPlugin"
  gsap.registerPlugin(ScrollToPlugin)
  import { CustomEase } from "gsap/CustomEase"
  gsap.registerPlugin(CustomEase)

  // ===================================================
  // Navigation on homepage, with scrolltrigger+scrub
  // ===================================================
  const scrollTrigger3d = {
    trigger: ".projects",
    start: "top top",
    end: "bottom bottom",
    scrub: .8,
  }

  // ===================================================
  // Navigation between "active" projects
  // ===================================================
  const route = useRoute()
  const projectViewReady = ref(false)

  function onProjectEnter(el, done) {
    const timeline = gsap.timeline()
    const elProjectView = el.querySelector('.project-view')

    document.body.style.overflowY = "hidden"
    timeline.from(elProjectView, {
      left: "100%",
      duration: 2,
      ease: "power3.inOut",
    })
    timeline.from(el, {
      backgroundColor: "#00000000",
      duration: 2.4,
      ease: "power2.inOut",
    }, "<")

    // Start project component animations
    timeline.call(() => projectViewReady.value = true)

    // Notify transition component that we're done
    timeline.call(done)
  }

  function onProjectLeave(el, done) {
    const timeline = gsap.timeline()
    const elProjectView = el.querySelector('.project-view')

    timeline.to(elProjectView, {
      left: "100%",
      duration: 2,
      ease: "power3.inOut",
    })
    timeline.to(el, {
      backgroundColor: "#00000000",
      duration: 2.4,
      ease: "power2.inOut",
    }, "<")
    
    timeline.call(() => document.body.style.overflowY = null, [], "-=1")

    // Notify transition component that we're done
    timeline.call(done)
  }

</script>

<template>
  <main>

    <!-- Project view -->
    <RouterView v-slot="{ Component }">
      <Teleport to="body">
          <Transition
            appear
            :css="false"
            @enter="onProjectEnter"
            @leave="onProjectLeave"
          >
            <!-- These elements are here instead of inside the view component
            so we can animate everything with the same timeline -->
            <div class="project-overlay" v-if="route.name == 'project'">
              <div class="project-view">
                <component :is="Component" :ready="projectViewReady" />
              </div>
            </div>
          </Transition>
      </Teleport>
    </RouterView>

    <!-- ThreeJS scene -->
    <Projects3d 
      :projects="projects"
      :activeProject="route.params.projectSlug"
      :scrollTrigger="scrollTrigger3d"
    />

    <!-- Project slides -->
    <div class="projects">
      <ProjectSlide :project="project" v-for="(project, index) in projects" :key="index" />
    </div>

  </main>
</template>

<style scoped>

  .projects {
    position: relative;
    z-index: 10;
    background-color: #b9644c00;
    transition: background-color 3s ease-in-out;
  }

  .project-overlay {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #0004;
  }

  .project-view {
    position: fixed;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 110;
    top: 0;
    left: 10%;
    width: 90%;
    height: 100%;
    background: #000;
  }
  
</style>