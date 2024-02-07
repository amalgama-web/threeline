<template lang="pug">
.matrix-page
  MatrixComponent(
    :matrix="matrix"
    @cell-click="cellClick($event)"
    @cell-dbl-click="cellDblClick($event)"
  )
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import { CellPointer } from '~/core/classes/CellPointer'

const matrix = ref(new Matrix())
fillMatrix(matrix.value)


const cellClick = (cellPointer: CellPointer) => {
  console.log('cellClick')
  console.log(cellPointer)
}
const cellDblClick = (cellPointer: CellPointer) => {
  console.log('cellDblClick')
  console.log(cellPointer)
}
</script>

<style lang="scss" scoped>
.matrix-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>