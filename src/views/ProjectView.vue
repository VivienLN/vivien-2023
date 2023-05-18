<script setup>
  import { usePinBody } from '../composables/pinbody.js'

  const props = defineProps({
    ready: {
      type: Boolean,
      required: false
    }
  })

  // Not use because instead of doing this on mount/unmount, its in a timeline in HomeView
  // usePinBody()
</script>

<template>
  <div>
    Ready: {{ props.ready }}
    Project view: {{ $route.params.projectSlug }}
    <div>
      <router-link class="link" to="/">Retour</router-link>
    </div>
    <p>
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
    </p>
  </div>
</template>

<style scoped>

</style>