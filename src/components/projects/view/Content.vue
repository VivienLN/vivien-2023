<script setup>
  import { computed } from 'vue'
  import { projectAsset } from '../../../helpers/projectHelpers.js'
  import ContentText from '@/components/projects/view/ContentText.vue'
  import ContentImage from '@/components/projects/view/ContentImage.vue'
  import ContentVideo from '@/components/projects/view/ContentVideo.vue'

  const props = defineProps({
    content: {
      type: Array,
      required: true
    }
  })

  function contentComponent(type) {
    const components = {
      text: ContentText,
      image: ContentImage,
      video: ContentVideo,
    }
    return components[type]
  }
</script>

<template>
  <div>
    <component v-for="(item, index) in content" :is="contentComponent(item.type)" :key="index" v-bind="item" />
  </div>
</template>