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
                @cell-dbl-click="dblclick(cellPointer)"
            )
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
import { Matrix } from '~/core/classes/Matrix';
import { fillMatrix } from '~/core/matrix-fill';
import { cellClick } from '~/core/game';
import { applyBooster } from '~/core/apply-boosters';
import { BoosterTypes, CellTypes } from '~/core/types';
import { CellPointer } from '~/core/classes/CellPointer';


export default {
    data() {
        return {
            matrix: null,
            editors: null,
            currentEditor: null,

            steps: 20,
            points: 0,
        }
    },

    computed: {},

    methods: {
        click(cellPointer) {
            if (!this.currentEditor === null) {
                this.editorModeClick(cellPointer)
                return;
            }

            if (cellClick(this.matrix, cellPointer)) {

            }

        },
        editorModeClick(cellPointer) {
            if (this.currentEditor.cell.type === CellTypes.booster) {
                cellPointer.cell.type = CellTypes.booster;
                cellPointer.cell.booster = this.currentEditor.cell.booster;
            } else {
                cellPointer.cell.type = this.currentEditor.cell.type;
            }
        },
        dblclick(cellPointer) {
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
        CellComponent,

    }
}

</script>

<style lang="scss" src="/styles/game.scss"></style>