<script setup>
  import AnimatedLetters from '@/components/AnimatedLetters.vue'
  import ScrollTriggerAnimation from '@/components/ScrollTriggerAnimation.vue'
  import ButtonArrow from '@/components/ui/ButtonArrow.vue'

  // ===================================================
  // Props
  // ===================================================
  const props = defineProps({
    project: {
      type: Object,
      required: true
    },
  })

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
</script>

<template>
  <section class="project" :class="`project-${project.slug}`">
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
            <ButtonArrow>Fais voir</ButtonArrow>
          </ScrollTriggerAnimation>
        </RouterLink>
      </div>
    </section>
</template>

<style scoped>

  .container {
    margin: 0 auto;
    max-width: 1200px;
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

  /* Has to be repeated */
  @keyframes arrow-hover {
    0% { left: 0%; }
    50% { left: 110%; }
    51% { left: -110%; }
    100% { left: 0%; }
  }

  .project .link:hover :deep(.btn) {
    background-color: #ffd04f;
    color: #000;
  }
  
  .project .link:hover :deep(.btn .arrow svg) {
    animation: arrow-hover .4s ease-in-out forwards;
  }
  
</style>