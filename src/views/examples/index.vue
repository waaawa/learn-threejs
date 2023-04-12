<template>
  <div>
    <div>index</div>
    <div class="list">
      <span v-for="link in links" @click="showPage(link.name)">{{ link.name }}</span>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup>
  const links = [{ name: 'networkTopology' }, { name: 'flyingLiine' }, { name: 'learnShader' }];

  function showPage(name: string) {
    console.log(name);

    // router.push({ name });
  }
</script>

<style lang="scss"></style>
