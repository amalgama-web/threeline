<template lang="pug">
.sandbox
  .sandbox__left
    CountComponent(:matrix="matrix")
    MatrixComponent(
      :matrix="matrix"
      @cell-click="cellClick($event)"
    )
    EditorsComponent(v-model="currentEditor")

  .sandbox__right
    div
      button.btn.mr-8(@click="fillRandom") Заполнить
      button.btn.mr-8(@click="clr") Очистить
    div
      button.btn.mr-8(@click="consoleMatrix") Console Matrix
      button.btn.mr-8(@click="consoleVariants") Console Variants
    div
      button.btn.mr-8(@click="highlightShapes") Подсветить фигуры
      button.btn.mr-8(@click="rst") Убрать подсветку
      button.btn.mr-8(@click="apply") Прим
      button.btn.mr-8(@click="getDown") Свиг
      button.btn.mr-8(@click="makeFullStep") =>
    div
      button.btn.btn_scs(@click="getVariants") Просчитать варианты

    variants(:variants="swapVariants" @variant-click="applySwap($event)")


    .variants(v-for="snowflake in snowflakeVariants" )
      div(v-for="(directionVariants, directionId) in snowflake")
        .variants__list-item
          .variants__link(
          ) {{`${SnowflakeMoveDirections[directionId]}:`}} {{directionVariants?.points}}

          .variants__popup(v-if="directionVariants && directionVariants.childVariants")
            variants(:variants="directionVariants.childVariants" @variant-click="applySwap($event)")


</template>


<script>

//todo перевести на TS index.vue
// import CellComponent from '/components/cell.vue'
import Variants from '~/components/variants.vue';
import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/core/constant-params';
import { BoosterTypes, CellTypes, SnowflakeMoveDirections } from '~/core/types';
import { symbolTypePairsRevert } from '~/core/matrix-manual-input';
import { cutShapesAndSetBoosters } from '~/core/cut/cut-shapes-and-set-boosters';
import { highlightShapes } from '~/core/highlighting/highlight-shapes';
import { getSwapVariants } from '~/core/variants/variants-of-swap';
import { fillMatrix } from '~/core/matrix-fill';
import { Matrix } from '~/core/classes/Matrix';
import { getSnowflakesVariants } from '~/core/snowflake-variants';
import { CellPointer } from '~/core/classes/CellPointer';
import { cellClick } from '~/core/game';


const cellTypesIDs = Object.values(CellTypes).filter(i => !isNaN(Number(i)) && Number(i) !== CellTypes.booster);
export default {
  data() {
    return {
      matrix: new Matrix(),

      swapVariants: [],
      snowflakeVariants: null,
      cellTypesIDs: cellTypesIDs,
      selectorType: null,
      fillText: '',

      //steps
      steps: [],
      stepAction: null,
      stepChain: '_',
      customLinkName: '',

      // applies
      initialCombination: null,

      // game numeration
      gameNumber: 0,

      editors: null,
      currentEditor: null,

    }
  },
  computed: {
    SnowflakeMoveDirections() {
      return SnowflakeMoveDirections
    },
    points() {
      return this.matrix.totalPoints
    },
    currentSymbols() {
      const symbols = []
      this.matrix.map(row => row.map(cell => {
        if (cell.type === CellTypes.booster) {
          symbols.push(cell.booster)
        } else {
          symbols.push(symbolTypePairsRevert[cell.type])
        }
      }))
      return symbols.join('')
    },
    typesCounter() {
      return this.matrix.typesCounters
    },

    stringMatrix() {
      return this.matrix.matrixToString
    },

    jsonMatrix() {
      return this.matrix.matrixToJSON
    }
  },

  methods: {

    cellClick(cellPointer) {
      if (this.currentEditor === null) {
        cellClick(this.matrix, cellPointer)
        return;
      }

      // editor click
      if (this.currentEditor.cell.type === CellTypes.booster) {
        cellPointer.cell.type = CellTypes.booster;
        cellPointer.cell.booster = this.currentEditor.cell.booster;
      } else {
        cellPointer.cell.type = this.currentEditor.cell.type;
      }
    },

    //  combinations
    highlightShapes() {
      highlightShapes(this.matrix, this.initialCombination)
      this.initialCombination = null;
    },
    apply() {
      cutShapesAndSetBoosters(this.matrix)
      this.matrix.reset();
      this.initialCombination = null;
    },
    getDown() {
      this.matrix.matrixGetDown();
    },
    consoleMatrix() {
      console.log(this.matrix)
    },
    consoleVariants() {
      console.log(this.swapVariants)
    },
    async makeFullStep() {
      highlightShapes(this.matrix, this.initialCombination)
      this.initialCombination = null;

      await this.delay();
      cutShapesAndSetBoosters(this.matrix)
      this.matrix.reset();

      await this.delay();
      this.matrix.matrixGetDown();
    },
    async delay() {
      return new Promise(r => setTimeout(r, 100))
    },

    rst() {
      this.matrix.reset();
    },

    clr() {
      this.matrix.clear();
    },

    getVariants() {
      this.swapVariants = getSwapVariants(this.matrix, 3);
      this.snowflakeVariants = getSnowflakesVariants(this.matrix);
    },

    applySwap(variant) {
      const [{r: r1, c: c1}, {r: r2, c: c2}] = variant.swap
      this.initialCombination = variant.swap;
      this.stepAction = `${r1}${c1}:${r2}${c2}`;
      this.matrix.swapCells(variant.swap)
    },


    fillRandom() {
      fillMatrix(this.matrix);
    },

    variantStyle({points}) {
      if (points === 5 || points === 8) return {
        color: '#ffff00'
      }
      if (points >= 9) {
        return {
          color: 'red'
        }
      }
      if (points === 6) return {
        color: 'green'
      }
      return null;
    },

    editorClick(cellPointer) {
      if (this.currentEditor === cellPointer) {
        this.currentEditor = null;
        return;
      }
      this.currentEditor = cellPointer;
    }
  },

  mounted() {
    this.editors = []

    for (let key in CellTypes) {
      const index = Number(key)
      if (isNaN(index) || index === CellTypes.booster) continue;
      this.editors.push(new CellPointer({r: 0, c: 0}, index))
    }

    for (let key in BoosterTypes) {
      const index = Number(key)
      if (isNaN(index)) continue;
      const pointer = new CellPointer({r: 0, c: 0}, CellTypes.booster)
      pointer.cell.booster = index
      this.editors.push(pointer)
    }
  },

  components: {
    Variants
  }
}

</script>

<style lang="scss" src="/styles/pages/sandbox.scss"></style>