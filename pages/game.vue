<template lang="pug">
.container
    .game__grid.mb-24
        .game__grid-inner
            .grid
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
                        @cell-dbl-click="dblclick(cellPointer)"
                    )
    .game__grid
        .game__grid-inner
            .grid
                .grid__row
                    CellComponent(
                        v-for="(cellPointer, cellIndex) in editors"
                        :type="cellPointer.cell.type"
                        :selected="cellPointer === currentEditor"
                        :booster="cellPointer.cell.booster"
                        @cell-click="editorClick(cellPointer)"
                    )
</template>


<script>
import CellComponent from '~/components/cell.vue';
import { Matrix } from '~/logic/classes/Matrix';
import { fillMatrix } from '~/logic/matrix-fill';
import { cellClick } from '~/logic/game';
import { applyBooster } from '~/logic/apply-boosters';
import { BoosterTypes, CellTypes } from '~/logic/types';
import { CellPointer } from '~/logic/classes/CellPointer';


export default {
    data() {
        return {
            matrix: null,
            editors: null,
            currentEditor: null,
        }
    },

    computed: {},

    methods: {
        click(cellPointer) {
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
        dblclick(cellPointer) {
            console.log('dbl click')
            if (cellPointer.cell.type === CellTypes.booster) {
                applyBooster(this.matrix, cellPointer.coords);
            }
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
        this.matrix = new Matrix()
        fillMatrix(this.matrix);

        this.editors = []

        for (let key in CellTypes) {
            const index = Number(key)
            if (isNaN(index) || index === CellTypes.booster) break;
            this.editors.push(new CellPointer({r: 0, c: 0}, index))
        }

        for (let key in BoosterTypes) {
            const index = Number(key)
            if (isNaN(index)) break;
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

<style lang="scss" src="/styles/game.scss"></style>