<template>
  <p class="subtitle">
    <slot></slot>
  </p>
</template>

<style scoped>
  .subtitle {
    font-size: var(--size-project-subtitle);
    color: var(--title-color);
    letter-spacing: .04em;
    display: inline-block;
    text-transform: uppercase;
    text-shadow: .03em .05em .4em rgba(0, 0, 0, .1);
    margin-bottom: 1rem;
  }
</style>