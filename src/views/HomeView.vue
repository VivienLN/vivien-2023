<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
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
            y: 80,
            scale: .8,
          }, "<.025")
        })
      })

      // Animate subtitle (whole block)
      gsap.from(project.querySelector('.subtitle'), {
        scrollTrigger: projectTrigger,
        duration: .8,
        delay: .1,
        ease: "power3.out",
        opacity: 0,
        y: 40,
      })
      gsap.from(project.querySelector('.btn'), {
        scrollTrigger: projectTrigger,
        duration: .2,
        delay: .1,
        ease: "power3.out",
        opacity: 0,
        y: 20,
      })

      
    })
  })

  // ===================================================
  // Navigation functions
  // ===================================================

  // Null or index of "open" project
  const activeProject = ref(null)
  
  watch(activeProject, (newValue, oldValue) => {
    console.log(`from ${oldValue} to ${newValue}`)
    // Disable window scroll when a project is active
    document.body.style.overflow = newValue !== null ? "hidden" : null
  })
  
  // TODO: Old nav: remove
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
    </div>
    <Projects3d 
      :currentIndex="currentIndex"
      :projects="projects"
      :settings="sceneSettings"
      :activeProject="activeProject"
      scrollTriggerElement=".projects"
    />
    <div class="projects" :class="{'has-active': activeProject !== null}">
      <section class="project" :class="{active: index === activeProject}" v-for="(project, index) in projects" :key="index">
        <div class="header container">
          <a class="link" href="#" @click.prevent="activeProject=index">
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
          </a>
        </div>
        <div class="content container" v-if="index === activeProject">
            <a class="btn" href="#" @click.prevent="activeProject=null">Quitter</a>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis est non consequat vestibulum. Etiam mi metus, suscipit sit amet posuere vel, auctor vitae lacus. Mauris tempor, lorem non dignissim rhoncus, risus odio mollis enim, in commodo tortor turpis et neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis augue augue, porttitor vel elementum faucibus, faucibus quis neque. Maecenas quis sagittis lorem, sit amet consequat quam. Suspendisse potenti. Quisque non blandit augue. Vivamus consequat tellus quis tellus varius vehicula. Aliquam vitae ornare sapien, sit amet ornare mauris. Donec nibh ipsum, finibus at neque venenatis, ultricies sagittis mi. Phasellus malesuada quam ac erat dapibus, eget ullamcorper eros porta. Nulla nisl nisi, fermentum commodo porttitor consectetur, auctor nec odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          <br>
          <br>
          Integer lorem nibh, vestibulum nec eros porta, posuere elementum lorem. In hac habitasse platea dictumst. Maecenas vitae sollicitudin nisi. Suspendisse nisl urna, aliquam ut turpis non, tempus tincidunt metus. Donec dictum nunc eu fringilla convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum dui id nisi pretium, eu feugiat metus dapibus. Nunc nec finibus ex.

          <br>
          <br>
          Vivamus dictum porttitor posuere. Suspendisse mattis in metus eget fringilla. Sed sit amet blandit felis, sed efficitur dolor. Praesent egestas maximus risus vitae fermentum. Donec tincidunt, ipsum in accumsan imperdiet, ligula nulla laoreet est, id tincidunt nibh leo vitae dolor. In auctor urna in nisl dignissim lobortis. Nam consectetur ipsum sed nisl facilisis hendrerit. Etiam efficitur vitae libero at varius. Curabitur iaculis tellus non nunc vestibulum euismod. Etiam porttitor, ante vitae volutpat rhoncus, neque felis ornare est, vel scelerisque erat orci et erat. Nulla a velit sit amet neque mollis vulputate quis in risus. Suspendisse potenti. Sed vel libero vel sem venenatis sollicitudin vel vitae lorem. Fusce tristique luctus quam.
          <br>
          <br>

          Etiam venenatis mi nec nulla placerat venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla eget quam sed nunc tristique vestibulum a a justo. Ut dignissim, arcu vel egestas tincidunt, magna ligula pulvinar purus, nec sollicitudin nisl eros non libero. Suspendisse in varius risus. Sed quis dui non odio ultricies aliquam quis quis ex. Pellentesque pharetra at nisl nec condimentum. Nunc pretium velit augue, eu semper neque aliquam eget. Nam ut sapien a lectus finibus fringilla non et metus. Cras vel ligula sed lacus pharetra cursus.
          <br>
          <br>

          In ut gravida mauris. Sed tempus orci a lacus hendrerit ornare. Nunc venenatis ac felis non aliquet. Sed fermentum tellus at porta molestie. Donec luctus pulvinar augue. Cras non leo id nisl tincidunt fermentum. Mauris et orci ac diam lacinia aliquet.
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

  .project .content {
    font-size: 1.8rem;
    line-height: 1.5;
    margin-bottom: auto;
  }

  .projects.has-active {
    background-color: #3a213add;
  }
  .project.active {
    overflow-y: scroll;
  }
  .project.active .content {
    /* height: 100vh;
    opacity: 1; */
    /* overflow: visible; */
  }
</style>