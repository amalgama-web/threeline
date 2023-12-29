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
                //button.btn.mr-8(@click="fillRandom") Rand
                button.btn.mr-8(@click="consoleMatrix") Console Matrix
                button.btn.mr-8(@click="consoleVariants") Console Variants
            input.game__buttons-input(v-model="fillText")
        .mb-24
            button.btn.mr-8(@click="highlightFigures") Пдсв
            button.btn.mr-8(@click="resetMatrix") Убр пдсв
            button.btn.mr-8(@click="apply") Прим
            button.btn.mr-8(@click="getDown") Свиг
            button.btn.mr-8(@click="makeFullStep") =>
        .mb-24
            button.btn.mr-8.mr-8(@click="saveStep") Сохранить шаг
            input(v-model="customLinkName")
        div
            button.btn.btn_scs(@click="getVariants") Просчитать варианты

        variants(:variants="existedVariants" @variant-click="applyCellsSwap($event)")

        .variants(v-for="snowflake in snowflakeBoosters" )
            div(v-for="(directionConfig, directionName) in snowflake")
                .variants__list-item
                    .variants__link(
                    ) {{`${directionName}:`}} {{directionConfig?.points}}

                    .variants__popup(v-if="directionConfig && directionConfig.childVariants")
                        variants(:variants="directionConfig.childVariants" @variant-click="applyCellsSwap($event)")

    .game__grid
        .game__grid-inner
            .grid.mr-8
                .grid__row
                    CellComponent
                    CellComponent(v-for="(item, index) in Array(MATRIX_WIDTH)" @cell-click="removeCol(index)") {{index}}
                .grid__row(v-for="(row, rowIndex) in matrix")
                    CellComponent(@cell-click="removeRow(rowIndex)") {{rowIndex}}
                    CellComponent(
                        v-for="(cell, cellIndex) in row"
                        :type="cell.type"
                        :highlighted="cell.isCellInFigure"
                        :is-cell-for-removing="cell.isCellForRemoving"
                        :future-booster="cell.emergingBooster"
                        :booster="cell.booster"
                        @cell-click="gridCellClick(rowIndex, cellIndex)"
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
        .flex.flex_p-center.flex_s-center
            span Snow
            CellComponent(
                :type="5"
                :booster="'snowflake'"
                :highlighted="snowflakeClickActive"
                @cell-click="snowflakeClickActive = !snowflakeClickActive"
            )
</template>


<script>
import CellComponent from '/components/cell.vue'
import Variants from '~/components/variants.vue';
import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes, ZeroCell } from '~/logic/types';
import { colorTypePairs, colorTypePairsRevert } from '~/logic/matrix-manual-input';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import {
    applyCellsSwap,
    matrixGetDown,
} from '~/logic/find-figures';
import { resetMatrix } from '~/logic/reset-matrix/reset-matrix';
import { findSunInVariantsTree } from '~/logic/variants/variants-with-sun-booster';
import { BoosterTypes } from '~/logic/types';
import { MATRIX_LAST_ROW, MATRIX_LAST_COL } from '~/logic/constant-params';
import { checkSnowflakes } from '~/logic/snowflake-variants';
import { highlightFigures } from '~/logic/highlighting/highlighting';
import { getTotalPoints, getSwapVariants } from '~/logic/variants/variants-of-swap';


const cellTypesIDs = Object.values(CellTypes).filter(i => !isNaN(Number(i)) && Number(i) !== CellTypes.booster);

export default {
    data() {
        return {
            matrix: Array(MATRIX_HEIGHT).fill(Array(MATRIX_WIDTH).fill(0, 0), 0),

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
        points() {
            return getTotalPoints(this.matrix)
        },
        currentSymbols() {
            const symbols = []
            this.matrix.map(row => row.map(cell => {
                if (cell.type === CellTypes.booster) {
                    symbols.push(cell.booster)
                } else {
                    symbols.push(colorTypePairsRevert[cell.type])
                }
            }))
            return symbols.join('')
        },
        typesCounter() {
            const counter = {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
            }
            this.matrix.map(row => row.map(cell => {
                counter[cell.type]++
            }))
            return counter

        }
    },

    methods: {

        newGame() {
            this.gameNumber = +this.gameNumber + 1;
            window.localStorage.setItem('gameNumber', this.gameNumber)
        },

        gridCellClick(r, c) {
            if (!this.snowflakeClickActive) {
                this.setCellType(r, c)
            } else {
                this.matrix[r][c] = new ZeroCell()
                if (r > 0) this.matrix[r - 1][c] = new ZeroCell()
                if (r < MATRIX_LAST_ROW) this.matrix[r + 1][c] = new ZeroCell()
                if (c > 0) this.matrix[r][c - 1] = new ZeroCell()
                if (c < MATRIX_LAST_COL) this.matrix[r][c + 1] = new ZeroCell()
            }
        },
        removeCol(c) {
            for (let r = 0; r < MATRIX_HEIGHT; r++) {
                this.matrix[r][c] = new ZeroCell();
            }
        },

        removeRow(r) {
            for (let c = 0; c < MATRIX_WIDTH; c++) {
                this.matrix[r][c] = new ZeroCell();
            }
        },

        fullyRemoveType(removedType) {
            for (let r = 0; r < MATRIX_HEIGHT; r++) {
                for (let c = 0; c < MATRIX_WIDTH; c++) {
                    if (this.matrix[r][c]['type'] === removedType) {
                        this.matrix[r][c] = new ZeroCell();
                    }
                }
            }
        },

        // cell defines and loads
        setCellType(rowIndex, cellIndex) {
            this.matrix[rowIndex][cellIndex].type = this.selectorType;
        },

        //  combinations
        highlightFigures() {
            highlightFigures(this.matrix, this.initialCombination)
            this.initialCombination = null;
        },
        apply() {
            cutFiguresAndSetBoosters(this.matrix)
            resetMatrix(this.matrix)
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
            highlightFigures(this.matrix, this.initialCombination)
            this.initialCombination = null;

            setTimeout(() => {
                cutFiguresAndSetBoosters(this.matrix)
                resetMatrix(this.matrix)
                setTimeout(() => {
                    matrixGetDown(this.matrix)
                }, 200);
            }, 200);
        },
        resetMatrix() {
            resetMatrix(this.matrix)
        },

        getVariants() {
            this.existedVariants = getSwapVariants(this.matrix, 3);
            // todo в этой функции мы помечаем только не находим
            findSunInVariantsTree(this.existedVariants)
            this.snowflakeBoosters = checkSnowflakes(this.matrix);

            console.log(this.existedVariants)
            console.log(this.snowflakeBoosters)
        },
        applyCellsSwap(variant) {
            this.initialCombination = [
                {
                    r: variant.swap[0].r,
                    c: variant.swap[0].c
                },
                {
                    r: variant.swap[1].r,
                    c: variant.swap[1].c
                }
            ];
            this.stepAction = `${variant.swap[0].r}${variant.swap[0].c}:${variant.swap[1].r}${variant.swap[1].c}`;
            applyCellsSwap(this.matrix, variant.swap);
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

            for (let r = 0; r < MATRIX_HEIGHT && colorTypePairs[clearedText[i]] !== undefined; r++) {
                for (let c = 0; c < MATRIX_WIDTH && colorTypePairs[clearedText[i]] !== undefined; c++) {
                    if (!onlyGaps || this.matrix[r][c]['type'] === null) {
                        const newSymbol = clearedText[i]
                        const newCellType = colorTypePairs[newSymbol]
                        const newBooster = BoosterTypes[newSymbol]
                        this.matrix[r][c]['type'] = newCellType
                        if (newBooster !== undefined) {
                            this.matrix[r][c]['booster'] = newSymbol
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
            this.matrix = this.matrix.map(row => row.map(cell => ({
                type: getRandomInt(5),
                isCellInFigure: false,
            })))

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
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
        const LSGameNumber = window.localStorage.getItem(`gameNumber`);
        this.gameNumber = LSGameNumber ? LSGameNumber : 0;

        this.matrix = this.matrix.map(row => row.map(cell => new ZeroCell()))

        let LSKeys = Object.keys(localStorage)
            .filter(item => item.includes(`game${this.gameNumber}`))
            .map(item => item.replace(`game${this.gameNumber}`, ''));
        LSKeys = LSKeys.sort((item1,
                              item2) => (item1.match(/_/g) || []).length > (item2.match(/_/g) || []).length ? 1 : -1)
        this.steps = LSKeys.map(item => ({stepChain: item}))
    },

    components: {
        CellComponent,
        Variants
    }
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>