<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
  import gsap from "gsap"

  const props = defineProps({
    scrollTrigger: {
      type: Object,
      required: false
    },
    from: {
      type: Object,
      required: false
    },
  })

  const wrapper = ref(null)

  onMounted(() => {
    console.log("wrapper", wrapper.value)

    gsap.from(wrapper.value, {
      scrollTrigger: props.scrollTrigger,
      ...props.from
    })
  })

</script>

<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>