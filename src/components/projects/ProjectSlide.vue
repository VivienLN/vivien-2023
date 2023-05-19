<script setup>
  import AnimatedLetters from '@/components/AnimatedLetters.vue'
  import ScrollTriggerAnimation from '@/components/ScrollTriggerAnimation.vue'
  import ButtonArrow from '@/components/ui/ButtonArrow.vue'
  import Container from '@/components/ui/Container.vue'
  import Title from '@/components/projects/Title.vue'
  import Subtitle from '@/components/projects/Subtitle.vue'

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
      <Container class="header">
        <RouterLink class="link" :to="'/'+project.slug">
          <Title>
            <AnimatedLetters 
              :text="project.title" 
              :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
              :from="gsapTitleFrom"
              :delay="gsapTitleDelay"
            />
          </Title>
          <ScrollTriggerAnimation
              :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
              :from="{duration: .6, opacity: 0, y: 60, ease: 'power3.out', delay: .1}"
          >
            <Subtitle>{{ project.subtitle }}</Subtitle>
          </ScrollTriggerAnimation>
          
          <ScrollTriggerAnimation
              :scrollTrigger='{...scrollTriggerContent, trigger: `.project-${project.slug}`}'
              :from="{duration: .6, opacity: 0, y: 60, ease: 'power3.out', delay: .2}"
          >
            <ButtonArrow>Fais voir</ButtonArrow>
          </ScrollTriggerAnimation>
        </RouterLink>
      </Container>
    </section>
</template>

<style scoped>

  .project {
    height: 100vh;
  }

  .header {
    height: 80vh;
    padding-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .link {
    position: relative;
    display: block;
    padding-bottom: 5rem;
    text-decoration: none;
    color: #ffc;
    font-size: min(3vw, 1.5vh);
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