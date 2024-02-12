<template lang="pug">
.matrix
  .matrix__row(v-if="withIndexes")
    CellComponent(
      v-for="(cellPointer, idx) in emptyCells"
    )
      span(v-if="idx !== 0" ) {{idx - 1}}

  .matrix__row(v-for="(row, idx) in matrix")
    CellComponent(
      v-if="withIndexes"
    )
      span {{idx}}
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
  matrix: Matrix,
  withIndexes?: boolean,
}

const props = defineProps<Props>()
const emit = defineEmits<{
  cellClick: [ CellPointer ],
  cellDblClick: [ CellPointer ],
}>()

const emptyCells = new Array(props.matrix.width + 1).fill(new CellPointer())

const cellClick = (cellPointer: CellPointer) => {
  emit('cellClick', cellPointer)
}

const cellDblClick = (cellPointer: CellPointer) => {
  emit('cellDblClick', cellPointer)
}


</script>


<style src="./styles.scss" scoped lang="scss"></style>