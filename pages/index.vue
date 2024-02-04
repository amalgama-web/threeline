<template lang="pug">
.container
  .counters.opposite
    .counters__item {{points}}
    .counters__item {{steps}}
  .grid.mb-24
    .grid__row(v-for="(row, rowIndex) in matrix")
      CellComponent(
        v-for="(cellPointer, cellIndex) in row"
        :type="cellPointer.cell.type"
        :highlighted="cellPointer.cell.isCellInShape"
        :is-cell-for-removing="cellPointer.cell.isCellForRemoving"
        :future-booster="cellPointer.cell.emergingBooster"
        :booster="cellPointer.cell.booster"
        :selected="cellPointer.cell.isCellSelected"
        @cell-click="click(cellPointer)"
        @cell-dbl-click="doubleClick(cellPointer)"
      )
  .grid(v-if="editorsMode")
    .grid__row
      CellComponent(
        v-for="(cellPointer, cellIndex) in editors"
        :type="cellPointer.cell.type"
        :selected="cellPointer === currentEditor"
        :booster="cellPointer.cell.booster"
        @cell-click="editorClick(cellPointer)"
      )
</template>


<script lang="ts">
import CellComponent from '~/components/cell.vue'
import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import { cellClick, makeFullStep } from '~/core/game'
import { applyBooster } from '~/core/apply-boosters'
import { BoosterTypes, CellTypes, SwapCells } from '~/core/types'
import { CellPointer } from '~/core/classes/CellPointer'


export default {
  data(): {
    matrix: Matrix,
    editors: CellPointer[],
    currentEditor: CellPointer | null,
    steps: number,
    points: number,
    editorsMode: boolean,
    gameOver: boolean,
  } {
    return {
      matrix: new Matrix,
      editors: [],
      currentEditor: null,

      steps: 10,
      points: 0,

      editorsMode: true,
      gameOver: false,
    }
  },

  computed: {},

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


    // обычные ячейки
    for (let key in CellTypes) {
      const index = Number(key)
      if (isNaN(index) || index === CellTypes.booster) continue

      const pointer = new CellPointer({r: 0, c: 0}, index)
      this.editors.push(pointer)
    }

    for (let key in BoosterTypes) {
      const index = Number(key)
      if (isNaN(index)) continue

      const pointer = new CellPointer({r: 0, c: 0}, CellTypes.booster)
      pointer.cell.booster = index
      this.editors.push(pointer)
    }


  },

  components: {
    CellComponent,
  }
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>