<script setup>
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import Container from '@/components/ui/Container.vue'
  import Info from '@/components/projects/view/Info.vue'
  import Title from '@/components/projects/Title.vue'
  import Subtitle from '@/components/projects/Subtitle.vue'
  import AnimatedLetters from '@/components/AnimatedLetters.vue'
  import ScrollTriggerAnimation from '@/components/ScrollTriggerAnimation.vue'
  import { ref, onMounted, defineProps } from 'vue'

  // ===================================================
  // Props
  // ===================================================
  const props = defineProps({
    banner: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    info: {
      type: Array,
      required: false
    },
  })

  
  // ===================================================
  // Animations
  // ===================================================
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
  <header>
    <img class="banner" :src="projectAsset(banner)" />
    <Container>
      <Title>
        <AnimatedLetters 
          :text="title" 
          :from="gsapTitleFrom"
          :delay="gsapTitleDelay"
        />
      </Title>
      <Subtitle class="subtitle">
        {{ subtitle }}
      </Subtitle>
      <Info :data="info" v-if="info" />
    </Container>
  </header>
</template>

<style scoped>
  header {
    margin-bottom: min(14rem, 14vh);
  }

  .banner {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: min(10rem, 10vh);
  }

  .subtitle {
    margin-bottom: min(8rem, 8vh);
  }

</style>