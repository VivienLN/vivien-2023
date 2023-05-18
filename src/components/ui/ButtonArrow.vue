<script setup>
  
</script>

<template>
  <span class="btn">
    <span><slot></slot></span>
    <i class="arrow">
      <svg viewBox="6 4 14 18"><path d="M13.293 7.293a.999.999 0 0 0 0 1.414L15.586 11H8a1 1 0 0 0 0 2h7.586l-2.293 2.293a.999.999 0 1 0 1.414 1.414L19.414 12l-4.707-4.707a.999.999 0 0 0-1.414 0z"/></svg>
    </i>
  </span>
</template>

<style scoped>

  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: .5em;
    padding: 1rem 1.6rem .86rem;
    border: 2px solid #ffd04f;
    color: #ffd04f;
    text-decoration: none;
    border-radius: .4rem;
    transition: .4s ease-in-out;
    letter-spacing: .08em;
  }

  .arrow {
    fill: currentColor;
    position: relative;
    width: 1.2rem;
    height: 1.2rem;
    overflow: hidden;
  }

  .arrow svg {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  @keyframes arrow-hover {
    0% { left: 0%; }
    50% { left: 110%; }
    51% { left: -110%; }
    100% { left: 0%; }
  }

  .btn:hover {
    background-color: #ffd04f;
    color: #000;
  }
  /* .project .link:hover .btn .arrow svg { */
  .btn:hover .arrow svg {
    animation: arrow-hover .4s ease-in-out forwards;
  }
</style>