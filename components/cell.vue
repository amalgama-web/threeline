<template lang="pug">
.cell(
    :class="cellClasses"
    @click="cellClick()"
    @dblclick="cellDblClick()"
)
    .cell__inner(:style="cellStyle")
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

import { CellTypes } from '~/core/types';
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

import { BoosterTypes } from '~/core/types';

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
        isCellForRemoving: {
            type: Boolean,
            default: false
        },
        futureBooster: {
            type: [Boolean, Object],
            default: false
        },
        booster: {
            type: Number,
            default: null,
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cellStyle() {
            if (this.type === CellTypes.empty) {
                return null
            }

            if (this.type === CellTypes.booster) {
                return {
                    backgroundImage: boostersBgs[this.booster]
                }
            }

            return {
                backgroundImage: bgs[this.type]
            }
        },
        cellClasses() {
            return [
                {
                    'cell_highlighted': this.highlighted,
                    'cell_deleted': this.isCellForRemoving,
                    'cell_future-booster': this.futureBooster,
                    'cell_selected': this.selected,
                },
                this.booster ? `cell_booster-${BoosterTypes[this.booster]}` : null
            ]
        }
    },
    methods: {
        cellClick() {
            this.$emit('cell-click', this.type)
        },
        cellDblClick() {
            this.$emit('cell-dbl-click', this.type)

        }
    }
}
</script>

<style lang="scss" src="/styles/component-cell.scss"></style>