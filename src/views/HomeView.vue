<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import Projects3d from '@/components/Projects3d.vue'
  import projects from '@/data/projects.json'
  
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
  // Text mangagement
  // ===================================================
  function computeText(input) {
    let words = input.split(" ")
    words = words.map(w => `<span>${w.split("").join("</span><span>")}</span>`)
    return `<span class="word">${words.join('</span> <span class="word">')}</span>`
  }

  // ===================================================
  // Animation
  // ===================================================
  onMounted(() => {

    // Animate project titles
    Array.from(document.querySelectorAll('.project')).forEach(project => {
      const projectTrigger = {
        trigger: project,
        start: "top center",
        end: "bottom+=20% center",
        toggleActions: "play reset restart reset",
      }
      // Create a timeline to animate title separated letters
      const titleTimeline = gsap.timeline({
        scrollTrigger: projectTrigger
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
            y: 60,
            scale: .8,
          }, "<.025")
        })
      })

      // Animate subtitle (whole block)
      gsap.from(project.querySelector('.subtitle'), {
        scrollTrigger: projectTrigger,
        duration: .8,
        delay: .3,
        ease: "power3.out",
        opacity: 0,
        y: -10,
      })

      
    })
  })

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
          <h2 class="title" v-html="computeText(project.title)"></h2>
          <p class="subtitle">{{ project.subtitle }}</p>
          <div>
            <a class="btn" href="#">Voir</a>
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
  .projects {
    position: relative;
    z-index: 10;
  }
  section.project {
    height: 80vh;
    padding: 0 10vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    color: #ffc;
    font-size: min(3vw, 1.5vh);
  }
  .title {
    font-size: min(20vw, 10vh);
    font-weight: normal;
    /* text-transform: uppercase; */
    font-family: 'Allenoire', sans-serif;
    /* letter-spacing: .02em; */
    /* text-shadow: .06em .08em 0 #7b5698;  */
    text-shadow: .02em .04em .1em rgba(0, 0, 0, .1); 
  }
  .subtitle {
    display: inline-block;
    text-transform: uppercase;
    font-family: sans-serif;
    font-weight: bold;
    text-shadow: .03em .05em .4em rgba(0, 0, 0, .1); 
    margin-bottom: 2rem;
  }
  .btn {
    padding: 1rem;
    background: #fd2;
    color: #000;
    display: inline-block;
  }
</style>