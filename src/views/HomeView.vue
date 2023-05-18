<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import AnimatedLetters from '@/components/AnimatedLetters.vue'
  import ScrollTriggerAnimation from '@/components/ScrollTriggerAnimation.vue'
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
  // Text mangagement
  // ===================================================
  function computeText(input) {
    let words = input.split(" ")
    words = words.map(w => `<span>${w.split("").join("</span><span>")}</span>`)
    return `<span class="word">${words.join('</span> <span class="word">')}</span>`
  }

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
  // Animation inside project titles etc.
  // ===================================================
  const scrollTriggerContent = {
    start: "top center",
    end: "bottom+=20% center",
    toggleActions: "play reset restart reset",
  }
  const gsapTitleFrom = {
    duration: .4,
    ease: "power2.out",
    opacity: 0,
    y: 80,
    scale: .6,
  }
  const gsapTitleDelay = "<6%"

  // ===================================================
  // Navigation between "active" projects
  // ===================================================
  const route = useRoute()
  const projectViewReady = ref(false)

  const isAnyProjectActive = computed(() => {
    return route.name === 'project'
  })

  function isProjectActive(project) {
    return isAnyProjectActive && route.params.projectSlug === project.slug
  }

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
    timeline.call(() => {projectViewReady.value = true; 
    console.log(projectViewReady.value)})

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
    <Projects3d 
      :projects="projects"
      :activeProject="route.params.projectSlug"
      :scrollTrigger="scrollTrigger3d"
    />
    <div class="projects">
      <section class="project" :class="[{active: isProjectActive(project)}, `project-${project.slug}`]" v-for="(project, index) in projects" :key="index">
        <div class="header container">
          <RouterLink class="link" :to="'/'+project.slug">
            <h2 class="title">
              <AnimatedLetters 
                :text="project.title" 
                :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
                :from="gsapTitleFrom"
                :delay="gsapTitleDelay"
              />
            </h2>
            <ScrollTriggerAnimation
                :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
                :from="{duration: .6, opacity: 0, y: 60, ease: 'power3.out', delay: .1}"
            >
              <p class="subtitle">{{ project.subtitle }}</p>
            </ScrollTriggerAnimation>
            
            <ScrollTriggerAnimation
                :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
                :from="{duration: .6, opacity: 0, y: 60, ease: 'power3.out', delay: .2}"
            >
              <span class="btn">
                <span>Fais voir</span>
                <i class="arrow">
                  <svg viewBox="6 4 14 18"><path d="M13.293 7.293a.999.999 0 0 0 0 1.414L15.586 11H8a1 1 0 0 0 0 2h7.586l-2.293 2.293a.999.999 0 1 0 1.414 1.414L19.414 12l-4.707-4.707a.999.999 0 0 0-1.414 0z"/></svg>
                </i>
              </span>
            </ScrollTriggerAnimation>
          </RouterLink>
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
  .container {
    margin: 0 auto;
    max-width: 1200px;
  }
  .projects {
    position: relative;
    z-index: 10;
    background-color: #b9644c00;
    transition: background-color 3s ease-in-out;
  }

  .project {
    height: 100vh;
    /* margin-bottom: -20vh; */
  }

  .project .header {
    height: 80vh;
    padding: 20vh 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .project .link {
    position: relative;
    display: block;
    padding-bottom: 5rem;
    text-decoration: none;
    color: #ffc;
    font-size: min(3vw, 1.5vh);
  }

  .title {
    font-size: min(20vw, 10vh);
    font-weight: normal;
    font-family: 'Allenoire', sans-serif;
    text-shadow: .02em .04em .1em rgba(0, 0, 0, .1); 
    line-height: 1;
    margin-bottom: .1rem;
  }

  .subtitle {
    font-size: 1.2rem;
    letter-spacing: .08em;
    display: inline-block;
    text-transform: uppercase;
    text-shadow: .03em .05em .4em rgba(0, 0, 0, .1);
    margin-bottom: 1rem;
  }

  .project .link .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: .5em;
    padding: 1rem 1.6rem .86rem;
    border: 2px solid #ffd04f;
    color: #ffd04f;
    text-decoration: none;
    border-radius: .4rem;
    transition: .4s ease-in-out;
    letter-spacing: .08em;
  }

  .project .link .btn .arrow {
    fill: currentColor;
    position: relative;
    width: 1.2rem;
    height: 1.2rem;
    overflow: hidden;
  }

  .project .link .btn .arrow svg {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  @keyframes arrow-hover {
    0% { left: 0%; }
    50% { left: 110%; }
    51% { left: -110%; }
    100% { left: 0%; }
  }

  .project .link:hover .btn {
    background-color: #ffd04f;
    color: #000;
  }
  .project .link:hover .btn .arrow svg {
    animation: arrow-hover .4s ease-in-out forwards;
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