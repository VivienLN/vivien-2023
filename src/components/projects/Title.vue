<template>
  <h1>
    <slot></slot>
  </h1>
</template>

<style scoped>
  h1 {
    font-size: var(--size-project-title);
    color: var(--title-color);
    font-weight: normal;
    font-family: var(--title-font);
    text-shadow: .02em .04em .1em rgba(0, 0, 0, .1); 
    line-height: 1;
    margin-bottom: .1rem;
  }
</style>