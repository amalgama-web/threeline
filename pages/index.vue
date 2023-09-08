<template lang="pug">
.game
    .game__counts
        | Total: {{points}}
        //button.btn(@click="generate") Сгенерировать
        div
            button.btn.mr-8(@click="fillFromText") Заполнить
            button.btn(@click="clearFillText") Очистить текст
        input.game__counts-text(v-model="fillText")
        div
            button.btn.mr-8(@click="highlight") Подсветить
            button.btn.mr-8(@click="applyHighlight") Применить
            button.btn.mr-8(@click="getDown") Сдвинуть
            button.btn.mr-8(@click="makeFullStep") =>
        div
            button.btn.mr-8.mr-8(@click="save") Сохранить состояние
            button.btn.btn_err.mr-8(@click="load") Загрузить состояние
            input(v-model="postfix")
        button.btn(@click="calc") Просчитать варианты

        .game__variants
            .game__variants-item(v-for="variant in existedVariants" @click="applyVariant(variant)") {{variant}}

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
                v-for="(item, index) in Array(cellsTypesCount)"
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

            //stesp
        }
    },
    computed: {
        points() {
            return getTotalPoints(this.grid)
        }
    },
    mounted() {
        // generate types
        this.grid = this.grid.map(row => row.map(cell => ({
            type: undefined,
            // type: getRandomInt(cellsTypesCount),
            highlighted: false,
        })))
    },
    methods: {
        setCellType(type, rowIndex, cellIndex) {
            this.grid[rowIndex][cellIndex].type = type;
        },
        generate() {
            this.grid.forEach(row => {
                row.forEach(cell => {
                    cell.type = getRandomInt(cellsTypesCount);
                    cell.highlighted = false;
                })
            })
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
        save() {
            window.localStorage.setItem(`grid${this.postfix}`, JSON.stringify(this.grid))
        },
        load() {
            this.grid = JSON.parse(window.localStorage.getItem(`grid${this.postfix}`))
        },
        calc() {
            this.existedVariants = getExistedResults(this.grid);
        },
        applyVariant(variant) {
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
        }
    },
    components: {
        CellComponent
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

</script>

<style lang="scss" src="/styles/page-game.scss"></style>