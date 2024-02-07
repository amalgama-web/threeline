<template lang="pug">
.layout-default
  LayoutMenu
  .layout-default__page
    slot
</template>

<script setup lang="ts">
import LayoutMenu from '~/components/layouts/LayoutMenu.vue'
</script>

<style lang="scss">



ul, li {
  margin: 0;
  padding: 0;
}
</style>