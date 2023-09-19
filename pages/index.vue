<template lang="pug">
.game
    .game__history
        .step-list
            .step-item(v-for="step in steps")
                div
                    span.step-item__right.link.link_red(@click="removeStamp(step.stepChain)") Rmv
                    span.step-item__left  {{step.stepChain}}
                div
                    span.step-item__right.link(@click="loadStamp(step.stepChain)") Load


    .game__buttons
        .gap-15.mb-24
            div
                button.btn.mr-8(@click="fillFromText") Зап
                button.btn.mr-8(@click="fillOnlyGaps") Зап проп
                button.btn.mr-8(@click="fillRandom") Rand
                button.btn.mr-8(@click="consoleMatrix") Console
            input.game__buttons-input(v-model="fillText")
        .mb-24
            button.btn.mr-8(@click="highlightCombinations") Пдсв
            //button.btn.mr-8(@click="resetMatrix") Убр пдсв
            button.btn.mr-8(@click="applyCombinations") Прим
            button.btn.mr-8(@click="getDown") Свиг
            button.btn.mr-8(@click="makeFullStep") =>
        .mb-24
            button.btn.mr-8.mr-8(@click="saveStep") Сохранить шаг
            input(v-model="customLinkName")
        div
            button.btn.btn_scs(@click="getVariants") Просчитать варианты

        .game__variants
            // list item
            div(v-for="variant in existedVariants")
                .game__variants-list-item
                    // link to current variant
                    .game__variants-link(
                        @click="applyCellsSwap(variant)"
                        :style="variantStyle(variant.points)"
                    ) {{`${variant.cell1.r}${variant.cell1.c}:${variant.cell2.r}${variant.cell2.c} Points: ${variant.points}`}}

                    // popup with inner variants
                    .game__variants-popup
                        .game__variants-list-item(
                            v-for="innerVariant in variant.stepsAfter"
                        )
                            .game__variants-link.mr-8(:style="variantStyle(innerVariant.points)") {{innerVariant.points}}


        .game__variants(v-for="snow in snowflakeBoosters" )
            | {{snow}}

    .game__grid
        .game__grid-inner
            .grid.mr-8
                .grid__row
                    CellComponent
                    CellComponent(v-for="(item, index) in Array(gridWidth)" @cell-click="removeCol(index)") {{index}}
                .grid__row(v-for="(row, rowIndex) in grid")
                    CellComponent(@cell-click="removeRow(rowIndex)") {{rowIndex}}
                    CellComponent(
                        v-for="(cell, cellIndex) in row"
                        :type="cell.type"
                        :highlighted="cell.highlighted"
                        :deleted="cell.deleted"
                        :future-booster="cell.appliedBooster"
                        :booster="cell.booster"
                        @cell-click="setCellType(rowIndex, cellIndex)"
                    )
            .game__selectors
                CellComponent(
                    v-for="(item, index) in Array(cellsTypesNumber + 1)"
                    :type="index"
                    @cell-click="selectorType = $event"
                    :highlighted="index === selectorType"
                ) {{typesCounter[index]}}
                CellComponent(
                    :type="null"
                    @cell-click="selectorType = $event"
                    :highlighted="null === selectorType"
                )
        .game__grid-info
            | '{{currentSymbols}}'
        .flex.flex_p-center.flex_s-center
            span Rmv
            CellComponent(
                v-for="(item, index) in Array(cellsTypesNumber)"
                :type="index"
                @cell-click="fullyRemoveType($event)"
            )
</template>


<script>
import CellComponent from '/components/cell.vue'
// todo типа данных для координат и для ячейки
// coords = {r: num, c: num}
// line = {coords: coords, length: num}

import {
    gridWidth,
    gridHeight,
    getExistedVariants,
    getTotalPoints,
    applyCellsSwap,
    colorTypePairs,

    highlightCombinations,
    applyCombinations,
    resetMatrix,
    gridGetDown, checkSnowflakes, boosterTypePairs, boosterTypePairsRevert, colorTypePairsRevert, zeroCell, getZeroCell,
} from '~/logic/find-figures';


const cellsTypesNumber = 5;

export default {
    data() {
        return {
            grid: Array(gridHeight).fill(Array(gridWidth).fill(0, 0), 0),

            gridHeight: gridHeight,
            gridWidth: gridWidth,

            existedVariants: [],
            snowflakeBoosters: null,
            cellsTypesNumber: cellsTypesNumber,
            selectorType: null,
            fillText: '',

            //steps
            steps: [],
            stepAction: null,
            stepChain: '_',
            customLinkName: '',

            // applies
            initialCombination: null
        }
    },
    computed: {
        points() {
            return getTotalPoints(this.grid)
        },
        currentSymbols() {
            const symbols = []
            this.grid.map(row => row.map(cell => {
                if (cell.type === 5) {
                    symbols.push(boosterTypePairsRevert[cell.booster])
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
            this.grid.map(row => row.map(cell => {
                counter[cell.type]++
            }))
            return counter

        }
    },

    methods: {
        removeCol(c) {
            for (let r = 0; r < gridHeight; r++ ) {
                this.grid[r][c] = getZeroCell();
            }
        },

        removeRow(r) {
            for (let c = 0; c < gridWidth; c++ ) {
                this.grid[r][c] = getZeroCell();
            }
        },

        fullyRemoveType(removedType) {
            for (let r = 0; r < gridHeight; r++ ) {
                for (let c = 0; c < gridWidth; c++ ) {
                    if (this.grid[r][c]['type'] === removedType) {
                        this.grid[r][c] = getZeroCell();
                    }
                }
            }
        },

        // cell defines and loads
        setCellType(rowIndex, cellIndex) {
            this.grid[rowIndex][cellIndex].type = this.selectorType;
        },

        //  combinations
        highlightCombinations() {
            highlightCombinations(this.grid, this.initialCombination)
            this.initialCombination = null;
        },
        applyCombinations() {
            applyCombinations(this.grid)
            resetMatrix(this.grid)
            this.initialCombination = null;
        },
        getDown() {
            gridGetDown(this.grid)
        },
        consoleMatrix() {
            console.log(this.grid)
        },
        makeFullStep() {
            highlightCombinations(this.grid, this.initialCombination)
            this.initialCombination = null;

            setTimeout(() => {
                applyCombinations(this.grid)
                resetMatrix(this.grid)
                setTimeout(() => {
                    gridGetDown(this.grid)
                }, 200);
            }, 200);
        },
        resetMatrix() {
            resetMatrix(this.grid)
        },

        getVariants() {
            this.existedVariants = getExistedVariants(this.grid);
            this.snowflakeBoosters = checkSnowflakes(this.grid)
        },
        applyCellsSwap(variant) {
            this.initialCombination = [
                {
                    r: variant.cell1.r,
                    c: variant.cell1.c
                },
                {
                    r: variant.cell2.r,
                    c: variant.cell2.c
                }
            ];
            this.stepAction = `${variant.cell1.r}${variant.cell1.c}:${variant.cell2.r}${variant.cell2.c}`;
            applyCellsSwap(this.grid, variant);
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


            const stampName = `grid${this.stepChain}`;

            this.steps.push({
                stepChain: this.stepChain
            })
            this.stepAction = null;
            window.localStorage.setItem(stampName, JSON.stringify(this.grid))
            this.getVariants();
        },
        loadStamp(chain) {
            this.grid = JSON.parse(window.localStorage.getItem(`grid${chain}`));
            this.stepChain = chain;
            this.getVariants()
        },
        removeStamp(chain) {
            this.steps = this.steps.filter(item => item.stepChain !== chain)
            window.localStorage.removeItem(`grid${chain}`)
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

            for (let r = 0; r < gridHeight && colorTypePairs[clearedText[i]] !== undefined; r++ ) {
                for (let c = 0; c < gridWidth && colorTypePairs[clearedText[i]] !== undefined; c++ ) {
                    if (!onlyGaps || this.grid[r][c]['type'] === null) {
                        const newSymbol = clearedText[i]
                        const newCellType = colorTypePairs[newSymbol]
                        const newBooster = boosterTypePairs[newSymbol]
                        this.grid[r][c]['type'] = newCellType
                        if (newBooster !== undefined) {
                            this.grid[r][c]['booster'] = newBooster
                        } else {
                            this.grid[r][c]['booster'] = null
                        }
                        i++;
                    }
                }
            }
            this.fillText = ''
        },
        fillRandom() {
            this.grid = this.grid.map(row => row.map(cell => ({
                type: getRandomInt(5),
                highlighted: false,
            })))

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
        },


        variantStyle(points) {
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
        this.grid = this.grid.map(row => row.map(cell => JSON.parse(JSON.stringify(zeroCell))))

        let LSKeys = Object.keys(localStorage).filter(item => item.includes('grid')).map(item => item.replace('grid', ''));
        LSKeys = LSKeys.sort((item1, item2) => (item1.match(/_/g) || []).length > (item2.match(/_/g) || []).length ? 1 : -1)
        this.steps = LSKeys.map(item => ({stepChain: item}))
    },

    components: {
        CellComponent
    }
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>