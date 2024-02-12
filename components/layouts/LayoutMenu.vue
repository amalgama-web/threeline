<template lang="pug">
button.burger(@mouseover="open" :class="{open: isMenuOpen}")
  span.burger__inner

transition(name="fade")
  .menu-back(v-if="isMenuOpen" @click="close" @mouseover="close")

transition(name="slide-fade-left")
  ul.menu(v-if="isMenuOpen")
    li.menu__item(v-for="item in links")
      NuxtLink.menu__link(
        :to="item.to"
        @click="close"
      ) {{item.name}}

</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

const isMenuOpen = useState('isMenuOpen', () => false)

const links = computed(() => [
  {
    name: 'Game',
    to: '/',
  },
  {
    name: 'Sandbox',
    to: '/sandbox',
  },
  {
    name: 'Matrix component',
    to: '/matrix-component',
  },
  {
    name: 'Test generation',
    to: '/test-generate',
  },

])
const toggle = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const close = () => {
  isMenuOpen.value = false
}

const open = () => {
  isMenuOpen.value = true
}
</script>


<style src="./layout-menu.scss" scoped lang="scss"></style>