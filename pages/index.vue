<template lang="pug">
.container
  .counters.opposite
    .counters__item {{points}}
    .counters__item {{steps}}
  .matrix-wrap
    MatrixComponent.matrix(
      :matrix="matrix"
      @cell-click="click($event)"
      @cell-dbl-click="doubleClick($event)"
    )
  div {{currentEditor}}
  .editors-wrap
    EditorsComponent.editors(v-model="currentEditor")
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

  computed: {
    stringified: {
      get() {
        return this.matrix.matrixToString
      },
      set(nV: string) {
        console.log(nV)
      },
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

  watch: {
    stringified(nV) {
      storedMatrix.value = nV
    }
  },

  mounted() {
    if (storedMatrix.value) {
      this.matrix = Matrix.fromString(storedMatrix.value)
    } else {
      fillMatrix(this.matrix)
    }

    // обычные ячейки
    for (let key in CellTypes) {
      const index = Number(key)
      if (isNaN(index) || index === CellTypes.booster) continue

      const pointer = new CellPointer({ r: 0, c: 0 }, index)
      this.editors.push(pointer)
    }

    for (let key in BoosterTypes) {
      const index = Number(key)
      if (isNaN(index)) continue

      const pointer = new CellPointer({ r: 0, c: 0 }, CellTypes.booster)
      pointer.cell.booster = index
      this.editors.push(pointer)
    }


  },

  components: { EditorsComponent }
}

</script>

<style lang="scss" scoped>
.matrix-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .matrix {
    font-size: 1rem;
  }
}
.editors-wrap {
  display: flex;
  justify-content: center;

  margin-top: 3rem;
}
.editors {
  font-size: .8rem;
  display: flex;
  gap: 1em;
}
</style>