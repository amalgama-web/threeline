<template lang="pug">
.matrix-page

  CountComponent(:matrix="matrix")

  MatrixComponent.matrix-page__matrix(
    :matrix="matrix"
    :with-indexes="true"
    @cell-click="cellClick($event)"
    @cell-dbl-click="cellDblClick($event)"
  )

</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import { CellPointer } from '~/core/classes/CellPointer'

const matrix: Ref<Matrix> = ref(new Matrix())

nextTick(() => {
  fillMatrix(matrix.value)
})

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  gap: 2rem;

  &__matrix {
    font-size: 1rem;
  }
}
</style>