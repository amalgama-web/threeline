<template lang="pug">
.cell(
    :class="cellClasses"
    @click="cellClick()"
)
    .cell__inner(:style="cellStyle")

    .cell__select(v-if="selectIsVisible")
        .cell__select-item(
            v-for="(type, index) in typeColors"
            :style="calcStyles(index)"
            @click="selectItemClick(index)"
        )
        .cell__select-item.cell__select-item_close(
            @click="close()"
        ) x
    slot
</template>
<script>

import icon_coin from 'assets/coin.png'
import icon_case from 'assets/case.png'
import icon_wallet from 'assets/wallet.png'
import icon_hourglass from 'assets/hourglass.png'
import icon_pig from 'assets/pig.png'
import icon_snow from 'assets/icon-snow.png'
import icon_hRocket from 'assets/icon-hrocket.png'
import icon_vRocket from 'assets/icon-vrocket.png'
import icon_sun from 'assets/icon-sun.png'

import { CellTypes } from '~/logic/types';
const typeColors = [
    '#eabd29',
    '#ce1f1f',
    '#4455ff',
    '#ef77ff',
    '#8500b6',
    '#000',
]

const bgs = {
    [CellTypes.yellow]: `url(${icon_coin})`,
    [CellTypes.red]: `url(${icon_case})`,
    [CellTypes.blue]: `url(${icon_wallet})`,
    [CellTypes.pink]: `url(${icon_pig})`,
    [CellTypes.purple]: `url(${icon_hourglass})`,
}

const boostersBgs = {
    [BoosterTypes.hRocket]: `url(${icon_hRocket})`,
    [BoosterTypes.vRocket]: `url(${icon_vRocket})`,
    [BoosterTypes.snowflake]: `url(${icon_snow})`,
    [BoosterTypes.sun]: `url(${icon_sun})`,
}

import { BoosterTypes } from '~/logic/types';

export default {
    data() {
        return {
            typeColors: typeColors,
            selectIsVisible: false,
        }
    },
    props: {
        type: {
            type: [Number, null],
        },
        highlighted: {
            type: Boolean,
            default: false
        },
        forRemoving: {
            type: Boolean,
            default: false
        },
        futureBooster: {
            type: Boolean,
            default: false
        },
        booster: {
            type: String,
            default: null,
        },
    },
    computed: {
        cellStyle() {
            if (this.type === CellTypes.empty) {
                return null
            }

            if (this.type === CellTypes.booster) {
                return {backgroundImage: boostersBgs[this.booster]}
            }

            return {
                backgroundImage: bgs[this.type]
            }
        },
        cellClasses() {
            return [
                {
                    'cell_highlighted': this.highlighted,
                    'cell_deleted': this.forRemoving,
                    'cell_future-booster': this.futureBooster,
                },
                this.booster ? `cell_booster-${BoosterTypes[this.booster]}` : null
            ]
        }
    },
    methods: {
        cellClick() {
            this.$emit('cell-click', this.type)
        },
        calcStyles(index) {
            const radPerSection = 2 * Math.PI / 7;
            return {
                marginTop: 30 * Math.sin(radPerSection * index) + '%',
                marginLeft: 30 * Math.cos(radPerSection * index) + '%',
                backgroundColor: typeColors[index],
            }
        },
        selectItemClick(index) {
            if (index === 6) {
                index = null
            }
            this.$emit('typeSelected', index);
            setTimeout(() => {
                this.selectIsVisible = false;
            })
        },
        close() {
            setTimeout(() => {
                this.selectIsVisible = false;
            })
        }
    }
}
</script>

<style lang="scss" src="/styles/component-cell.scss"></style>