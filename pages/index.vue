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
                button.btn.mr-8(@click="fillFromText") Заполнить
                button.btn.mr-8(@click="fillOnlyGaps") Заполнить пропуски
                //button.btn.btn_err.mr-8(@click="clearFillText") Очистить текст
                //button.btn.mr-8(@click="fillRandom") Рандом
                button.btn.mr-8(@click="consoleMatrix") Console
            input.game__buttons-input(v-model="fillText")
        .mb-24
            button.btn.mr-8(@click="highlightCombinations") Пдсв
            button.btn.mr-8(@click="resetMatrix") Убр пдсв
            button.btn.mr-8(@click="applyCombinations") Прим
            button.btn.mr-8(@click="getDown") Свиг
            button.btn.mr-8(@click="makeFullStep") =>
            //button.btn.mr-8(@click="checkBoosters") Boosters
        .mb-24
            button.btn.mr-8.mr-8(@click="saveStep") Сохранить шаг
            input(v-model="customLinkName")
        div
            button.btn.btn_scs(@click="getVariants") Просчитать варианты

        .game__variants
            .game__variants-item(
                v-for="variant in existedVariants"
                @click="applyCellsSwap(variant)"
                :style="variantStyle(variant.points)"
            ) {{`${variant.cell1.r}${variant.cell1.c}:${variant.cell2.r}${variant.cell2.c} Points: ${variant.points}`}}
        .game__variants(v-for="snow in snowflakeBoosters" )
            | {{snow}}

    .game__grid
        .grid.mr-8
            .grid__row
                CellComponent
                CellComponent(v-for="(item, index) in Array(gridWidth)") {{index}}
            .grid__row(v-for="(row, rowIndex) in grid")
                CellComponent {{rowIndex}}
                CellComponent(
                    v-for="(cell, cellIndex) in row"
                    :type="cell.type"
                    :selector-type="selectorType"
                    :highlighted="cell.highlighted"
                    :deleted="cell.deleted"
                    :future-booster="cell.appliedBooster"
                    :booster="cell.booster"
                    @type-selected="setCellType($event, rowIndex, cellIndex)"
                )
        .game__selectors
            CellComponent(
                v-for="(item, index) in Array(cellsTypesCount + 1)"
                :type="index"
                :is-selector="true"
                @activate-selector="selectorType = $event"
                :highlighted="index === selectorType"
            )
            CellComponent(
                :type="null"
                :is-selector="true"
                @activate-selector="selectorType = $event"
                :highlighted="null === selectorType"
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
    gridGetDown, checkSnowflakes,
} from '~/logic/find-figures';


const cellsTypesCount = 5;

export default {
    data() {
        return {
            grid: Array(gridHeight).fill(Array(gridWidth).fill(0, 0), 0),

            gridHeight: gridHeight,
            gridWidth: gridWidth,

            existedVariants: [],
            snowflakeBoosters: null,
            cellsTypesCount: cellsTypesCount,
            selectorType: undefined,
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
            this.grid.map(row => row.map(cell => symbols.push(cell.type)))
            return symbols
        }
    },

    methods: {
        checkBoosters() {
            checkBoosters(this.grid);
        },
        // cell defines and loads
        setCellType(type, rowIndex, cellIndex) {
            this.grid[rowIndex][cellIndex].type = type;
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
            this.existedVariants = getExistedVariants(this.grid, this.initialCombination);
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
            let i = 0;
            const clearedText = this.fillText.replace(/ /g, '');
            this.grid = this.grid.map(row => row.map(cell => {
                const returned = {
                    type: clearedText[i] ? colorTypePairs[clearedText[i]] : cell.type,
                    highlighted: false,
                    deleted: false,
                    appliedBooster: null,
                }
                i++
                return returned
            }))
            this.fillText = ''
        },
        fillOnlyGaps() {
            let i = 0;
            const clearedText = this.fillText.replace(/ /g, '');

            this.grid = this.grid.map(row => row.map(cell => {
                const returned = {
                    type: cell.type === null && colorTypePairs[clearedText[i]] !== undefined ? colorTypePairs[clearedText[i++]] : cell.type,
                    booster: cell.booster,
                    highlighted: false,
                    deleted: false,
                    appliedBooster: null
                }
                return returned
            }))
            this.fillText = ''
        },
        clearFillText() {
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
        this.grid = this.grid.map(row => row.map(cell => ({
            type: null,
            highlighted: false,
            deleted: false,
            vLine: null,
            hLine: null,
            square: null,
        })))

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