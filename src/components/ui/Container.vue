<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<style scoped>

  .container {
    margin: 0 auto;
    padding-left: var(--container-padding);
    padding-right: var(--container-padding);
    max-width: var(--container-width);
  }

</style>