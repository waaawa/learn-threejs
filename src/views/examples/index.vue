<template>
  <div class="example-container">
    <div>index</div>
    <div class="list">
      <span class="item" v-for="link in links" @click="showPage(link.name)">{{ link.name }}</span>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const { push } = useRouter();

  const links = [{ name: 'networkTopology' }, { name: 'flyingLiine' }, { name: 'learnShader' }];

  function showPage(name: string) {
    push({ name });
  }
</script>

<style lang="scss">
  .example-container {
    .list {
      .item {
        cursor: pointer;
      }
    }
  }
</style>
