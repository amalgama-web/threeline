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
                button.btn.btn_err(@click="clearFillText") Очистить текст
            input.game__buttons-input(v-model="fillText")
        .mb-24
            button.btn.mr-8(@click="highlight") Подсв
            button.btn.mr-8(@click="applyHighlight") Прим
            button.btn.mr-8(@click="getDown") Свиг
            button.btn.mr-8(@click="makeFullStep") =>
        .mb-24
            button.btn.mr-8.mr-8(@click="saveStep") Сохранить шаг
            input(v-model="customLinkName")
            //button.btn.btn_err.mr-8(@click="loadLastStamp") Загрузить состояние
            //input(v-model="postfix")
        div
            button.btn.btn_scs(@click="calc") Просчитать варианты

        .game__variants
            .game__variants-item(
                v-for="variant in existedVariants"
                @click="applyVariant(variant)"
            ) {{`${variant.cell1.r}${variant.cell1.c}:${variant.cell2.r}${variant.cell2.c} Points: ${variant.points}`}}

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
                    @type-selected="setCellType($event, rowIndex, cellIndex)"
                )
        .game__selectors
            CellComponent(
                v-for="(item, index) in Array(cellsTypesCount + 2)"
                :type="index"
                :is-selector="true"
                @activate-selector="selectorType = selectorType === index ? null : index"
                :highlighted="index === selectorType"
            )
</template>


<script>
import CellComponent from '/components/cell.vue'
import {
    gridWidth,
    gridHeight,
    findVLines,
    findHLines,
    findSquare,
    highlightHLines,
    highlightVLines,
    highlightSquare,
    getExistedResults,
    getTotalPoints,
    applyVariant,
    removeHighlighted,
    gridGetDown,
    typeColors,
    colorTypePairs,
} from '~/logic/find-figures';


const cellsTypesCount = 5;

export default {
    data() {
        return {
            grid: Array(gridHeight).fill(Array(gridWidth).fill(0, 0), 0),

            gridHeight: gridHeight,
            gridWidth: gridWidth,

            existedVariants: [],
            cellsTypesCount: cellsTypesCount,
            selectorType: null,
            postfix: '',
            fillText: '',

            //steps
            steps: [],
            stepAction: null,
            stepChain: '_',
            customLinkName: '',
        }
    },
    computed: {
        points() {
            return getTotalPoints(this.grid)
        }
    },

    methods: {
        setCellType(type, rowIndex, cellIndex) {
            this.grid[rowIndex][cellIndex].type = type;
        },
        highlight() {
            highlightHLines(this.grid, findHLines(this.grid))
            highlightVLines(this.grid, findVLines(this.grid))
            highlightSquare(this.grid, findSquare(this.grid))
        },
        unHighlight() {
            this.grid.forEach(row => {
                row.forEach(cell => {
                    cell.highlighted = false;
                })
            })
        },
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
        },
        loadStamp(chain) {
            this.grid = JSON.parse(window.localStorage.getItem(`grid${chain}`));
            this.stepChain = chain;
        },
        removeStamp(chain) {
            this.steps = this.steps.filter(item => item.stepChain !== chain)
            window.localStorage.removeItem(`grid${chain}`)

        },
        calc() {
            this.existedVariants = getExistedResults(this.grid);
        },
        applyVariant(variant) {
            this.stepAction = `${variant.cell1.r}${variant.cell1.c}:${variant.cell2.r}${variant.cell2.c}`;
            applyVariant(this.grid, variant);
        },
        applyHighlight() {
            removeHighlighted(this.grid)
        },
        getDown() {
            gridGetDown(this.grid)
        },
        makeFullStep() {
            highlightHLines(this.grid, findHLines(this.grid))
            highlightVLines(this.grid, findVLines(this.grid))
            highlightSquare(this.grid, findSquare(this.grid))

            setTimeout(() => {
                removeHighlighted(this.grid)
                setTimeout(() => {
                    gridGetDown(this.grid)
                }, 200);
            }, 200);

        },
        fillFromText() {
            let i = 0;
            const clearedText = this.fillText.replace(/ /g, '');
            this.grid = this.grid.map(row => row.map(cell => ({
                type: colorTypePairs[clearedText[i++]],
                highlighted: false,
            })))
        },
        clearFillText() {
            this.fillText = ''
        },

    },

    mounted() {
        this.grid = this.grid.map(row => row.map(cell => ({
            type: undefined,
            highlighted: false,
        })))

        let LSKeys = Object.keys(localStorage).filter(item => item.includes('grid')).map(item => item.replace('grid',''));
        LSKeys = LSKeys.sort((item1, item2) => (item1.match(/_/g) || []).length > (item2.match(/_/g) || []).length ? 1 : -1)
        this.steps = LSKeys.map(item => ({stepChain: item}))
    },

    components: {
        CellComponent
    }
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>