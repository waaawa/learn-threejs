<template>
  <div>{{ name }}</div>
  <RouterView></RouterView>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      return {
        name: 'index'
      };
    }
  });
</script>

<style lang="scss"></style>
