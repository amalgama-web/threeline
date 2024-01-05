<template lang="pug">
.game
    .game__history
        .mb-24
            .btn.btn_err.mr-8(@click="newGame") New game
            | Game number {{gameNumber}}
        .step-list
            .step-item(v-for="step in steps")
                div
                    span.step-item__right.link.link_red(@click="removeStamp(step.stepChain)") Rmv
                    span.step-item__left {{step.stepChain}}
                div
                    span.step-item__right.link(@click="loadStamp(step.stepChain)") Load


    .game__buttons

        .gap-15.mb-24
            div
                button.btn.mr-8(@click="fillFromText") Заполнить
                button.btn.mr-8(@click="fillOnlyGaps") Запполнить пропуски
                button.btn.mr-8(@click="fillRandom") Rand
                button.btn.mr-8(@click="consoleMatrix") Console Matrix
                button.btn.mr-8(@click="consoleVariants") Console Variants
            input.game__buttons-input(v-model="fillText")
        .mb-24
            button.btn.mr-8(@click="highlightShapes") Пдсв
            button.btn.mr-8(@click="rst") Убр пдсв
            button.btn.mr-8(@click="apply") Прим
            button.btn.mr-8(@click="getDown") Свиг
            button.btn.mr-8(@click="makeFullStep") =>
        .mb-24
            button.btn.mr-8.mr-8(@click="saveStep") Сохранить шаг
            input(v-model="customLinkName")
        div
            button.btn.btn_scs(@click="getVariants") Просчитать варианты


        variants(:variants="existedVariants" @variant-click="applySwap($event)")


        .variants(v-for="snowflake in snowflakeBoosters" )
            div(v-for="(directionVariants, directionId) in snowflake")
                .variants__list-item
                    .variants__link(
                    ) {{`${SnowflakeMoveDirections[directionId]}:`}} {{directionVariants?.points}}

                    .variants__popup(v-if="directionVariants && directionVariants.childVariants")
                        variants(:variants="directionVariants.childVariants" @variant-click="applySwap($event)")

    .game__grid
        .game__grid-inner
            .grid.mr-8
                .grid__row
                    CellComponent
                    CellComponent(v-for="(item, index) in Array(MATRIX_WIDTH)" @cell-click="removeCol(index)") {{index}}
                .grid__row(v-for="(row, rowIndex) in matrix")
                    CellComponent(@cell-click="removeRow(rowIndex)") {{rowIndex}}
                    CellComponent(
                        v-for="(cellPointer, cellIndex) in row"
                        :type="cellPointer.cell.type"
                        :highlighted="cellPointer.cell.isCellInShape"
                        :is-cell-for-removing="cellPointer.cell.isCellForRemoving"
                        :future-booster="cellPointer.cell.emergingBooster"
                        :booster="cellPointer.cell.booster"
                        @cell-click="matrixCellClick(rowIndex, cellIndex)"
                    )
            .game__selectors
                CellComponent(
                    v-for="(item, index) in cellTypesIDs"
                    :type="index"
                    @cell-click="selectorType = $event"
                    :highlighted="index === selectorType"
                ) {{typesCounter[index]}}
        .game__grid-info
            | '{{currentSymbols}}'
        .flex.flex_p-center.flex_s-center
            span Rmv
            CellComponent(
                v-for="(item, index) in cellTypesIDs"
                :type="index"
                @cell-click="fullyRemoveType($event)"
            )
        //.flex.flex_p-center.flex_s-center
        //    span Snow
        //    CellComponent(
        //        :type="5"
        //        :booster="'snowflake'"
        //        :highlighted="snowflakeClickActive"
        //        @cell-click="snowflakeClickActive = !snowflakeClickActive"
        //    )
</template>


<script>

//todo перевести на TS index.vue
import CellComponent from '/components/cell.vue'
import Variants from '~/components/variants.vue';
import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes, SnowflakeMoveDirections } from '~/logic/types';
import { symbolTypePairs, symbolTypePairsRevert } from '~/logic/matrix-manual-input';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { findSunInVariantsTree } from '~/logic/variants/variants-with-sun-booster';
import { BoosterTypes } from '~/logic/types';
import { MATRIX_LAST_ROW, MATRIX_LAST_COL } from '~/logic/constant-params';
import { highlightShapes } from '~/logic/highlighting/highlight-shapes';
import { getTotalPoints, getSwapVariants } from '~/logic/variants/variants-of-swap';
import { fillMatrix } from '~/logic/matrix-fill';
import { Matrix } from '~/logic/classes/Matrix';
import { Cell } from '~/logic/classes/Cell';
import { getSnowflakesVariants } from '~/logic/snowflake-variants';


const cellTypesIDs = Object.values(CellTypes).filter(i => !isNaN(Number(i)) && Number(i) !== CellTypes.booster);
export default {
    data() {
        return {
            matrix: new Matrix(),

            MATRIX_HEIGHT: MATRIX_HEIGHT,
            MATRIX_WIDTH: MATRIX_WIDTH,

            existedVariants: [],
            snowflakeBoosters: null,
            cellTypesIDs: cellTypesIDs,
            selectorType: null,
            fillText: '',

            // snowflake
            snowflakeClickActive: false,

            //steps
            steps: [],
            stepAction: null,
            stepChain: '_',
            customLinkName: '',

            // applies
            initialCombination: null,

            // game numeration
            gameNumber: 0
        }
    },
    computed: {
        SnowflakeMoveDirections() {
            return SnowflakeMoveDirections
        },
        points() {
            return getTotalPoints(this.matrix)
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
            return this.matrix.counters
        }
    },

    methods: {

        newGame() {
            this.gameNumber = +this.gameNumber + 1;
            window.localStorage.setItem('gameNumber', this.gameNumber)
        },

        matrixCellClick(r, c) {
            this.setCellType(r, c)
            // if (!this.snowflakeClickActive) {
            // } else {
            //     this.matrix[r][c] = new ZeroCell()
            //     if (r > 0) this.matrix[r - 1][c] = new ZeroCell()
            //     if (r < MATRIX_LAST_ROW) this.matrix[r + 1][c] = new ZeroCell()
            //     if (c > 0) this.matrix[r][c - 1] = new ZeroCell()
            //     if (c < MATRIX_LAST_COL) this.matrix[r][c + 1] = new ZeroCell()
            // }
        },
        // removeCol(c) {
        //     for (let r = 0; r < MATRIX_HEIGHT; r++) {
        //         this.matrix[r][c] = new ZeroCell();
        //     }
        // },

        // removeRow(r) {
        //     for (let c = 0; c < MATRIX_WIDTH; c++) {
        //         this.matrix[r][c] = new ZeroCell();
        //     }
        // },

        fullyRemoveType(removedType) {
            this.matrix.eachCell(cellPointer => {
                if (cellPointer.cell.type === removedType) {
                    cellPointer.cell = new Cell()
                }
            })
        },

        // cell defines and loads
        setCellType(r, c) {
            this.matrix[r][c].cell.type = this.selectorType;
        },

        //  combinations
        highlightShapes() {
            highlightShapes(this.matrix, this.initialCombination)
            this.initialCombination = null;
        },
        apply() {
            cutFiguresAndSetBoosters(this.matrix)
            this.matrix.reset();
            this.initialCombination = null;
        },
        getDown() {
            matrixGetDown(this.matrix)
        },
        consoleMatrix() {
            console.log(this.matrix)
        },
        consoleVariants() {
            console.log(this.existedVariants)
        },
        makeFullStep() {
            highlightShapes(this.matrix, this.initialCombination)
            this.initialCombination = null;

            setTimeout(() => {
                cutFiguresAndSetBoosters(this.matrix)
                this.matrix.reset();
                setTimeout(() => {
                    matrixGetDown(this.matrix)
                }, 200);
            }, 200);
        },

        rst() {
            this.matrix.reset();
        },

        getVariants() {
            this.existedVariants = getSwapVariants(this.matrix, 3);

            // todo в этой функции мы только помечаем, не находим, само солнце находится в getSwapVariants
            findSunInVariantsTree(this.existedVariants)
            this.snowflakeBoosters = getSnowflakesVariants(this.matrix);
        },
        applySwap(variant) {
            const [{r: r1, c: c1}, {r: r2, c: c2}] = variant.swap
            this.initialCombination = [
                {
                    r: r1,
                    c: c1
                },
                {
                    r: r2,
                    c: c2
                }
            ];
            this.stepAction = `${r1}${c1}:${r2}${c2}`;
            this.matrix.swapCells(variant.swap)
        },

        // stamps
        saveStep() {
            if (this.customLinkName !== '') {
                this.stepChain += `${this.customLinkName}_`;
            } else {
                if (this.stepAction !== null) {
                    this.stepChain += `${this.stepAction}_`;
                }
            }
            this.customLinkName = '';


            this.steps.push({
                stepChain: this.stepChain
            })
            this.stepAction = null;
            window.localStorage.setItem(this.getChainNameForLS(this.stepChain), JSON.stringify(this.matrix))
            this.getVariants();
        },

        getChainNameForLS(chain) {
            return `game${this.gameNumber}${chain}`
        },

        loadStamp(chain) {
            this.matrix = JSON.parse(window.localStorage.getItem(this.getChainNameForLS(chain)));
            this.stepChain = chain;
            this.getVariants()
        },
        removeStamp(chain) {
            this.steps = this.steps.filter(item => item.stepChain !== chain)
            window.localStorage.removeItem(this.getChainNameForLS(chain))
        },
        fillFromText() {
            this.fillMatrix()
        },
        fillOnlyGaps() {
            this.fillMatrix(true)
        },
        fillMatrix(onlyGaps = false) {
            let i = 0;
            const clearedText = this.fillText.replace(/ /g, '');

            for (let r = 0; r < MATRIX_HEIGHT && symbolTypePairs[clearedText[i]] !== undefined; r++) {
                for (let c = 0; c < MATRIX_WIDTH && symbolTypePairs[clearedText[i]] !== undefined; c++) {
                    if (!onlyGaps || this.matrix[r][c]['type'] === null) {
                        const newSymbol = clearedText[i]
                        const newCellType = symbolTypePairs[newSymbol]
                        const newBooster = BoosterTypes[newSymbol]
                        this.matrix[r][c]['type'] = newCellType
                        if (newBooster !== undefined) {
                            this.matrix[r][c]['booster'] = BoosterTypes[newBooster]
                        } else {
                            this.matrix[r][c]['booster'] = null
                        }
                        i++;
                    }
                }
            }
            this.fillText = ''
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
        }

    },

    mounted() {
        // const LSGameNumber = window.localStorage.getItem(`gameNumber`);
        // this.gameNumber = LSGameNumber ? LSGameNumber : 0;
        //
        // this.matrix = this.matrix.map(row => row.map(cell => new ZeroCell()))
        //
        // let LSKeys = Object.keys(localStorage)
        //     .filter(item => item.includes(`game${this.gameNumber}`))
        //     .map(item => item.replace(`game${this.gameNumber}`, ''));
        // LSKeys = LSKeys.sort((item1,
        //                       item2) => (item1.match(/_/g) || []).length > (item2.match(/_/g) || []).length ? 1 : -1)
        // this.steps = LSKeys.map(item => ({stepChain: item}))


    },

    components: {
        CellComponent,
        Variants
    }
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>