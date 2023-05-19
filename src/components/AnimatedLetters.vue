<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
  import gsap from "gsap"

  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    scrollTrigger: {
      type: Object,
      required: false
    },
    from: {
      type: Object,
      required: true
    },
    clip: {
      type: Boolean,
      required: false
    },
    delay: {
      type: String,
      required: false
    },
  })

  const wrapper = ref(null)

  const computedText = computed(() => {
    let words = props.text.split(" ")
    words = words.map(w => `<span>${w.split("").join("</span><span>")}</span>`)
    return `<span class="word">${words.join('</span> <span class="word">')}</span>`
  })

  onMounted(createAnimation)

  function createAnimation() {
    const scrollTrigger = props.scrollTrigger || null
    const wrapperElement = wrapper.value
    const delay = props.delay || 0

    // Create a timeline to animate title separated letters
    const titleTimeline = gsap.timeline({
      scrollTrigger: scrollTrigger
    })

    Array.from(wrapperElement.querySelectorAll('.word')).forEach(word => {
      // word.style.display = "inline-block"
      Array.from(word.querySelectorAll('span')).forEach(letter => {
        // letter.style.display = "inline-block"
        titleTimeline.from(letter, props.from, delay)
      })
    })
  }

</script>

<template>
  <span 
    ref="wrapper" 
    :class="{clip: props.clip}" 
    v-html="computedText"
  ></span>
</template>

<style scoped>
  /* Use :deep because .word and spans are created dynamically */
  :deep .word, :deep .word > span {
    display: inline-block;
  }

  :deep.clip {
    display: inline-block;
    overflow: hidden;
  }
</style>