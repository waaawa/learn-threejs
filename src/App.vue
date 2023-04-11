<template>
  <div id="app">
    <!-- <ThreeShader /> -->
    <ThreeRenderer />
  </div>
</template>

<script>
  import ThreeRenderer from './components/ThreeRenderer.vue';
  import ThreeShader from './components/ThreeShader.vue';

  export default {
    components: {
      ThreeRenderer,
      ThreeShader
    }
  };
</script>
