<template lang="pug">
.matrix
  .matrix__row(v-for="row in matrix")
    CellComponent(
      v-for="cellPointer in row"
      :type="cellPointer.cell.type"
      :highlighted="cellPointer.cell.isCellInShape"
      :is-cell-for-removing="cellPointer.cell.isCellForRemoving"
      :future-booster="cellPointer.cell.emergingBooster"
      :booster="cellPointer.cell.booster"
      :selected="cellPointer.cell.isCellSelected"
      @cell-click="cellClick(cellPointer)"
      @cell-dbl-click="cellDblClick(cellPointer)"
    )
</template>
<script setup lang="ts">
import { Matrix } from '~/core/classes/Matrix'
import { CellPointer } from '~/core/classes/CellPointer'

interface Props {
  matrix: Matrix
}

const props = defineProps<Props>()
const emit = defineEmits<{
  cellClick: [ CellPointer ],
  cellDblClick: [ CellPointer ],
}>()

const cellClick = (cellPointer: CellPointer) => {
  emit('cellClick', cellPointer)
}

const cellDblClick = (cellPointer: CellPointer) => {
  emit('cellDblClick', cellPointer)
}


</script>


<style scoped lang="scss">
.matrix {
  $gap: 4px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $gap;
  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap;
  }
}
</style>