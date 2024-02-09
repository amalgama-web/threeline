<template lang="pug">
.game-container

  .counters.opposite
    .counters__item {{ outputPoints }}
    .counters__item {{ steps }}

  .matrix-wrap
    MatrixComponent.matrix(
      :matrix="matrix"
      @cell-click="click($event)"
      @cell-dbl-click="doubleClick($event)"
    )

  .editors-wrap(v-if="editorsMode")
    EditorsComponent.editors(
      v-model="currentEditor"
    )

  transition(name="fade")
    .game-over(v-if="showFinalScreen")
      .game-over__text
        p Игра завершена
        p Вы набрали {{outputPoints}}
      button.btn.game-over__btn(@click="startNewGame") Начать новую
</template>


<script lang="ts" setup>

import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import { cellClick, makeFullStep } from '~/core/game'
import { applyBooster } from '~/core/apply-boosters'
import { BoosterTypes, CellTypes } from '~/core/types'
import type { SwapCells } from '~/core/types'
import { CellPointer } from '~/core/classes/CellPointer'
import { ref } from 'vue'
import type { Ref } from 'vue'

const matrix: Ref<Matrix> = ref(new Matrix())

const currentEditor: Ref<CellPointer | null> = ref(null)
const editorsMode: Ref<boolean> = ref(false)

const initialSteps = 20;
const steps = ref(initialSteps)
const points = ref(0)
const outputPoints = computed(() => points.value * 10)
const gameOver = computed(() => steps.value <= 0)

const isProcessing = ref(false)

const click = async (cellPointer: CellPointer) => {
  if (interactionDisabled.value) return

  if (currentEditor.value !== null) {
    editorModeClick(cellPointer)
    return
  }

  const isSuccessfulSwap: SwapCells | false = cellClick(matrix.value, cellPointer)

  if (isSuccessfulSwap) {
    isProcessing.value = true
    decSteps()
    points.value += await makeFullStep(matrix.value, isSuccessfulSwap)
    isProcessing.value = false
  }
}

const doubleClick = async (cellPointer: CellPointer) => {
  if (interactionDisabled.value) return

  if (cellPointer.cell.type === CellTypes.booster) {
    isProcessing.value = true
    decSteps()
    points.value += await applyBooster(matrix.value, cellPointer.coords)
    isProcessing.value = false
  }
}

const editorModeClick = (cellPointer: CellPointer) => {
  if (currentEditor.value === null) return

  if (currentEditor.value.cell.type === CellTypes.booster) {
    cellPointer.cell.type = CellTypes.booster
    cellPointer.cell.booster = currentEditor.value.cell.booster
  } else {
    cellPointer.cell.type = currentEditor.value.cell.type
  }
}

const startNewGame = () => {
  matrix.value.clear()
  fillMatrix(matrix.value)
  steps.value = initialSteps
  points.value = 0
}

const interactionDisabled = computed(() => {
  return gameOver.value || isProcessing.value
})

const showFinalScreen = computed(() => {
  return gameOver.value && !isProcessing.value
})

const decSteps = () => {
  if (gameOver.value) return
  steps.value--
}

onMounted(() => {
  fillMatrix(matrix.value)
})
</script>

<style lang="scss" scoped src="/styles/pages/page-game.scss"></style>