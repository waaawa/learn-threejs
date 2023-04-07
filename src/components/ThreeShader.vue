<template>
  <div id="container" ref="container"></div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import { init, animate } from '@/utils/three/demo2.js';

  export default {
    setup() {
      const container = ref(null);

      onMounted(() => {
        init();
        animate();
      });

      return {
        container
      };
    }
  };
</script>

<style>
  #container {
    height: 100vh;
    width: 100%;
  }
</style>
