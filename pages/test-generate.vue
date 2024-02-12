<template lang="pug">
.container
  .col.col_left
    .editor-wrap
      .editor-wrap__arrow
      div.gap-20
        button.btn.mr-8(@click="fill") Заполнить
        button.btn(@click="clear") Очистить
      MatrixComponent.matrix(
        :matrix="matrix"
        @cell-click="click($event)"
        @cell-dbl-click="doubleClick($event)"
      )
      EditorsComponent(
        v-model="currentEditor"
      )
  .col
    div.test-case(v-for="(testCase, idx) in testCases")
      .trigger(ref="triggers" :class="`trigger-${idx}`")
      MatrixComponent.test-case__matrix(
        :matrix="testCase.matrix"
      )
    button.btn(@click="addTestcase") + Добавить тест-кейс

</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { Matrix } from '~/core/classes/Matrix'
import { fillMatrix } from '~/core/matrix-fill'
import useMatrixEditor from '~/composable/useMatrixEditor'
import { CellPointer } from '~/core/classes/CellPointer'
import { id } from 'postcss-selector-parser'

const {
  currentEditor,
  cellClickEditorMode,
} = useMatrixEditor()

const matrix: Ref<Matrix> = ref(new Matrix())

const click = (cellPointer: CellPointer) => {
  if (currentEditor.value !== null) {
    cellClickEditorMode(cellPointer)
    return
  }
}
const doubleClick = (cellPointer: CellPointer) => {
}

const fill = () => {
  fillMatrix(matrix.value)
}
const clear = () => {
  matrix.value.clear()
}


interface TestCase {
  matrix: Matrix,
  result: any
}

let observer: any = null
if (process.client) {
  console.log('create observer')
  observer = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio !== 1) return;
    const index = +entries[0].target.className.replace(/\D/g, '')
    loadMatrix(index)
    console.log(index)
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 1
  })
}


const triggers: Ref<null | HTMLElement[]> = ref(null)
const testCases: Ref<TestCase[]> = ref([])
const addTestcase = () => {
  const nMatrix = new Matrix()
  fillMatrix(nMatrix)
  testCases.value.push({
    matrix: nMatrix,
    result: {
      r: 2,
      c: 2
    }
  })
  nextTick(() => {
    if (!process.client || triggers.value === null) return
    observer.observe(triggers.value[triggers.value.length - 1]);
  })
}

const loadMatrix = (idx: number) => {
  matrix.value = testCases.value[idx].matrix
}
onMounted(() => {
  // fillMatrix(matrix.value)
})
</script>


<style scoped lang="scss">
.container {
  max-width: 120rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  min-width: 0;
  margin: 0 auto;
}

.editor-wrap {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  align-items: flex-end;
  justify-content: center;

  min-height: 100vh;

  &__arrow {
    position: absolute;
    left: 100%;
    margin-left: 10px;
    top: 50%;
    width: 20px;
    height: 2px;
    background-color: red;
    transform: translateY(-50%);

    &:after {
      content: '';
      position: absolute;
      right: 0;
      left: 100%;
      top: 50%;
      margin-top: -3px;
      border: 3px solid transparent;
      border-left: 7px solid red;
    }
  }
}

.col {
  padding: 2rem 0;
}

.col_left {

}

.test-case {
  display: flex;
  margin-bottom: 4rem;
  min-height: 100vh;
  align-items: center;

  &__matrix {
    font-size: .7rem;
  }
}
.trigger {
  border: 1px solid red;
  height: 70vh;
}
</style>