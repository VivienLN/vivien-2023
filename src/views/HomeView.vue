<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'
  
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  gsap.registerPlugin(ScrollTrigger)
  import { ScrollToPlugin } from "gsap/ScrollToPlugin"
  gsap.registerPlugin(ScrollToPlugin)

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

  onMounted(() => {
    // Create scroll trigger for project content: titles/subtitles/etc.
    Array.from(document.querySelectorAll('.project')).forEach(project => {
      const scrollTriggerContent = {
        trigger: project,
        start: "top center",
        end: "bottom+=20% center",
        toggleActions: "play reset restart reset",
      }
      // Create a timeline to animate title separated letters
      const titleTimeline = gsap.timeline({
        scrollTrigger: scrollTriggerContent
      })

      Array.from(project.querySelectorAll('.title .word')).forEach(word => {
        word.style.display = "inline-block"
        Array.from(word.querySelectorAll('span')).forEach(letter => {
          letter.style.display = "inline-block"
          titleTimeline.from(letter, {
            duration: .6,
            ease: "power2.out",
            opacity: 0,
            x: 10,
            y: 80,
            scale: .8,
          }, "<.025")
        })
      })

      // Animate subtitle (whole block)
      gsap.from(project.querySelector('.subtitle'), {
        scrollTrigger: scrollTriggerContent,
        duration: .8,
        delay: .1,
        ease: "power3.out",
        opacity: 0,
        y: 40,
      })
      gsap.from(project.querySelector('.btn'), {
        scrollTrigger: scrollTriggerContent,
        duration: .2,
        delay: .1,
        ease: "power3.out",
        opacity: 0,
        y: 20,
      })

      
    })
  })

  // ===================================================
  // Navigation between "active" projects
  // ===================================================
  const route = useRoute()

  const isAnyProjectActive = computed(() => {
    return route.name === 'project'
  })

  function isProjectActive(project) {
    return isAnyProjectActive && route.params.projectSlug === project.slug
  }

  function onProjectEnter(el, done) {
    const timeline = gsap.timeline()
    const elProject = el.parentElement.parentElement.parentElement
    const elBackground = elProject.querySelector('.project-bg')
    const projectClientY = elProject.getBoundingClientRect().top
    const projectY = projectClientY + window.pageYOffset
    console.log(projectClientY)

    // Scroll to project 
    // (this will alose animate the 3d view because of scrolltrigger)
    timeline.to(window, {
      duration: Math.abs(projectClientY) * .002, 
      ease: "power2.inOut",
      scrollTo: projectY
    })

    // Invert scrollbars between body & project
    timeline.call(() => {
      document.body.style.overflowY = "hidden"
      elProject.style.overflowY = "scroll"
    })

    // Animate background
    timeline.to(elBackground, {
      duration: 1,
      ease: "power2.out",
      opacity: 1
    })

    // Animate content in
    timeline.fromTo(el, {
      opacity: 0,
      y: 100,
    }, {
      duration: 1,
      ease: "power4.out",
      opacity: 1,
      y: 0,
    }, "<")

    // Notify transition component that we're done
    timeline.call(done)
  }

  function onProjectLeave(el, done) {
    const timeline = gsap.timeline()
    const elProject = el.parentElement.parentElement.parentElement
    const elBackground = elProject.querySelector('.project-bg')

    // Back to project top
    timeline.to(elProject, {
      duration: 1, 
      ease: "power2.inOut",
      scrollTo: 0
    })

    // Animate content out
    timeline.to(el, {
      duration: 1,
      ease: "power4.in",
      opacity: 0,
      // y: 100,
    }, "<")

    // Animate background
    timeline.to(elBackground, {
      duration: 1,
      ease: "power2.out",
      opacity: 0
    })

    // Invert scrollbars between body & project
    timeline.call(() => {
      document.body.style.overflowY = "scroll"
      elProject.style.overflowY = "hidden"
    })
    
    // Notify transition component that we're done
    timeline.call(done)
  }

</script>

<template>
  <main>
    <Projects3d 
      :projects="projects"
      :activeProject="route.params.projectSlug"
      :scrollTrigger="scrollTrigger3d"
    />
    <div class="projects">
      <section class="project" :class="{active: isProjectActive(project)}" v-for="(project, index) in projects" :key="index">
        <div class="project-inner">
          <div class="project-bg"></div>
          <div class="project-content">
            <div class="header container">
              <RouterLink class="link" :to="'/'+project.slug">
                <h2 class="title" v-html="computeText(project.title)"></h2>
                <p class="subtitle">{{ project.subtitle }}</p>
                <div>
                  <span class="btn">
                    <span>Fais voir</span>
                    <i class="arrow">
                      <svg viewBox="6 4 14 18"><path d="M13.293 7.293a.999.999 0 0 0 0 1.414L15.586 11H8a1 1 0 0 0 0 2h7.586l-2.293 2.293a.999.999 0 1 0 1.414 1.414L19.414 12l-4.707-4.707a.999.999 0 0 0-1.414 0z"/></svg>
                    </i>
                  </span>
                </div>
              </RouterLink>
            </div>
            <RouterView :project="project" v-slot="{ Component }">
              <transition
                appear
                :css="false"
                @enter="onProjectEnter"
                @leave="onProjectLeave"
              >
                <div class="container" v-if="isProjectActive(project)">
                  <component :is="Component" />
                </div>
              </transition>
            </RouterView>
          </div>
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
    border: 4px solid red;
    /* margin-bottom: -20vh; */
  }

  .project .project-inner {
    position: relative;
  }

  .project .project-content {
    position: relative;
    z-index: 100;
  }

  .project .project-bg {
    position: absolute;
    z-index: 90;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    background: #000a;
    opacity: 0;
  }

  .project .header {
    height: 80vh;
    padding: 20vh 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .project .link {
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
    margin-bottom: .4rem;
  }

  .subtitle {
    font-size: 1.2rem;
    letter-spacing: .08em;
    display: inline-block;
    text-transform: uppercase;
    text-shadow: .03em .05em .4em rgba(0, 0, 0, .1); 
    margin-bottom: 4rem;
  }

  .project .link .btn {
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

  .project .content.v-enter-active {
    transition: all 1.2s .8s ease-out;
  }
  .project .content.v-leave-active {
    transition: all .6s .4s ease-in-out;
  }
  
  .project .content.v-enter-from,
  .project .content.v-leave-to {
    opacity: 0;
    transform: translateY(40px);
  }
</style>