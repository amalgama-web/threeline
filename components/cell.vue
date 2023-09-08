<template lang="pug">
.cell(
    :class="{'cell_highlighted': highlighted}"
    @click="cellClick()"
)
    .cell__inner(v-if="type !== undefined" :style="cellStyle")

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

const bgs = [
    `url(${icon_coin})`,
    `url(${icon_case})`,
    `url(${icon_wallet})`,
    `url(${icon_pig})`,
    `url(${icon_hourglass})`,
]

import { typeColors, imageTypePairs } from '~/logic/find-figures';
export default {
    data() {
        return {
            typeColors: typeColors,
            selectIsVisible: false,
        }
    },
    props: {
        type: {
            type: [Number, undefined],
        },
        highlighted: {
            type: Boolean,
            default: false
        },
        isSelector: {
            type: Boolean,
            default: false,
        },
        selectorType: {
            type: [Number, null],
            default: null,
        }
    },
    computed: {
        cellStyle() {
            if (this.type === null) {
                return null;
            }

            return imageTypePairs[this.type] ? {
                backgroundImage: bgs[this.type]
            } : {
                backgroundColor: typeColors[this.type]
            }
        }
    },
    methods: {
        cellClick() {
            if (this.isSelector) {
                this.$emit('activate-selector', this.type)
            } else {
                if (this.selectorType !== null) {
                    this.$emit('typeSelected', this.selectorType);
                } else {
                    this.selectIsVisible = true;
                }
            }
        },
        calcStyles(index) {
            const radPerSection = 2 * Math.PI / 7;
            return {
                marginTop: 30 * Math.sin(radPerSection * index) + '%',
                marginLeft: 30 * Math.cos(radPerSection * index) + '%',
                backgroundColor: typeColors[index]
            }
        },
        selectItemClick(index) {
            if (index === 6) {
                index = undefined
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