<template lang="pug">
div.editors
  CellComponent(
    v-for="cellPointer in editors"
    :type="cellPointer.cell.type"
    :selected="cellPointer === modelValue"
    :booster="cellPointer.cell.booster"
    @cell-click="cellClick(cellPointer)"
  )
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { CellTypes, BoosterTypes } from '~/core/types'
import { CellPointer } from '~/core/classes/CellPointer'

interface Props {
  // прокидываем модель текущего редактора ячеек
  modelValue: CellPointer | null
}

const props = defineProps<Props>()
const emits = defineEmits<{
  'update:modelValue': [ CellPointer | null ]
}>()

const editors: Ref<CellPointer[]> = ref([])

for (let key in CellTypes) {
  const index = Number(key)
  if (isNaN(index) || index === CellTypes.booster) continue

  const pointer = new CellPointer({ r: 0, c: 0 }, index)
  editors.value.push(pointer)
}

for (let key in BoosterTypes) {
  const index = Number(key)
  if (isNaN(index)) continue

  const pointer = new CellPointer({ r: 0, c: 0 }, CellTypes.booster)
  pointer.cell.booster = index
  editors.value.push(pointer)
}

const cellClick = (cellPointer: CellPointer) => {
  if (cellPointer === props.modelValue) {
    emits('update:modelValue', null)
    return
  }
  emits('update:modelValue', cellPointer)
}
</script>


<style scoped lang="scss">
.editors {
  display: flex;
  font-size: 1rem;
  gap: .7em;
}
</style>