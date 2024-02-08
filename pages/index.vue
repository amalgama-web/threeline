<template lang="pug">
.game-container
  .counters.opposite
    .counters__item {{points}}
    .counters__item {{steps}}
  .matrix-wrap
    MatrixComponent.matrix(
      :matrix="matrix"
      @cell-click="click($event)"
      @cell-dbl-click="doubleClick($event)"
    )
  .editors-wrap
    EditorsComponent.editors(
      v-model="currentEditor"
    )
</template>


<script lang="ts">
import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import { cellClick, makeFullStep } from '~/core/game'
import { applyBooster } from '~/core/apply-boosters'
import { BoosterTypes, CellTypes, SwapCells } from '~/core/types'
import { CellPointer } from '~/core/classes/CellPointer'
import { useStorage } from '@vueuse/core'
import EditorsComponent from '~/components/EditorsComponent/EditorsComponent.vue'

const storedMatrix = useStorage('matrix', '')

export default {
  data(): {
    matrix: Matrix,
    currentEditor: CellPointer | null,
    steps: number,
    points: number,
    editorsMode: boolean,
    gameOver: boolean,
  } {
    return {
      matrix: new Matrix,
      currentEditor: null,

      steps: 10,
      points: 0,

      editorsMode: true,
      gameOver: false,
    }
  },

  methods: {
    async click(cellPointer: CellPointer) {
      if (this.gameOver) return
      if (this.currentEditor !== null) {
        this.editorModeClick(cellPointer)
        return
      }

      const isSuccessfulSwap: SwapCells | false = cellClick(this.matrix, cellPointer)
      if (isSuccessfulSwap) {
        this.decSteps()
        this.points += await makeFullStep(this.matrix, isSuccessfulSwap)
      }
    },

    /** устанавливаем типы ячеек редактором */
    editorModeClick(cellPointer: CellPointer) {
      if (this.currentEditor === null) return

      if (this.currentEditor.cell.type === CellTypes.booster) {
        cellPointer.cell.type = CellTypes.booster
        cellPointer.cell.booster = this.currentEditor.cell.booster
      } else {
        cellPointer.cell.type = this.currentEditor.cell.type
      }
    },

    /** Применение бустера */
    async doubleClick(cellPointer: CellPointer) {
      if (this.gameOver) return
      if (cellPointer.cell.type === CellTypes.booster) {
        this.decSteps()
        this.points += await applyBooster(this.matrix, cellPointer.coords)
      }
    },

    decSteps() {
      this.steps--
      if (this.steps === 0) this.gameOver = true
    },

    /** Выбор ячейки редактора */
    editorClick(cellPointer: CellPointer) {
      if (this.currentEditor === cellPointer) {
        this.currentEditor = null
        return
      }
      this.currentEditor = cellPointer
    }
  },

  mounted() {
    fillMatrix(this.matrix)
  },

  components: { EditorsComponent }
}

</script>

<style lang="scss" scoped src="/styles/pages/page-game.scss"></style>