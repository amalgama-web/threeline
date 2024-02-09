<template lang="pug">
.counters
  CellComponent(
    v-for="(type, idx) in cellTypesIDs"
    :type="type"
  ) {{counters[idx]}}
</template>
<script setup lang="ts">
import { CellTypes } from '~/core/types'
import { Matrix } from '~/core/classes/Matrix'

interface Props {
  matrix: Matrix,
}
const props = defineProps<Props>()


const cellTypesIDs = Object.values(CellTypes).filter(i => {
  return !isNaN(Number(i)) && Number(i) !== CellTypes.booster
})

const counters = computed(() => {
  return props.matrix.typesCounters
})

</script>


<style scoped lang="scss">
.counters {
  display: flex;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  gap: .5em;
}
</style>