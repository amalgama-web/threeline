<template lang="pug">
.container
  h3 Первоначальная генерация матрицы
  div
    input.input.mr-8(v-model="generationNumberStr")
    button.btn(@click="generate") Сгенерировать
  div
    .graph
      .graph__scale(
        v-for="(item, index) in maxPossibleVariants"
        :style="scaleItemStyle(item, index)"
      )
      .graph__item(
        v-for="(item, index) in variantsCounter"
        :style="graphItemStyle(item, index)"
      )


</template>


<script>

import { CellTypes } from '~/core/types';
import { getSwapVariants } from '~/core/variants/variants-of-swap';
import { fillMatrix } from '~/core/matrix-fill';
import { Matrix } from '~/core/classes/Matrix';
import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/core/constant-params';

const maxPossibleVariants = (MATRIX_HEIGHT - 1) * (MATRIX_WIDTH - 1) * 2 + MATRIX_HEIGHT + MATRIX_WIDTH - 1
export default {
  data() {
    return {
      generationNumberStr: 10000,
      variantsCounter: Array(maxPossibleVariants + 1).fill(0),
      scale: 3,
      leftPadding: 0,
      maxPossibleVariants: maxPossibleVariants,

    }
  },

  computed: {
    generationNumber() {
      return isNaN(+this.generationNumberStr) ? 0 : +this.generationNumberStr;
    }
  },

  methods: {
    generate() {
      const matrix = new Matrix();
      for (let i = 1; i <= this.generationNumber; i++) {
        fillMatrix(matrix);
        const variants = getSwapVariants(matrix);
        this.variantsCounter[variants.length]++;
        matrix.clear();
      }
    },
    graphItemStyle(item, index) {
      return {
        height: `${item}px`,
        left: `${index * this.scale + this.leftPadding}px`,
        width: `${this.scale}px`
      }
    },
    scaleItemStyle(item, index) {
      return {
        left: `${index * this.scale + this.leftPadding}px`,
        width: `${this.scale}px`

      }
    }
  },

  mounted() {

  },

  components: {}
}

</script>

<style lang="scss" scoped src="/styles/generation-page.scss"></style>