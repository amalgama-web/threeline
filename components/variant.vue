<template lang="pug">
div
    div(v-for="variant in variants" )
        .game__variants-list-item
            .game__variants-link(
                @click="variantClick(variant)"
                :style="variantStyle(variant)"
                :class="{'has-sun':  variant.variantHasSun}"
            ) {{`${variant.swap[0].r}${variant.swap[0].c}:${variant.swap[1].r}${variant.swap[1].c} Points: ${variant.points}`}}

            .game__variants-popup(v-if="variant.childVariants")
                variant(
                    @variant-click=""
                )

</template>

<script>
import Variant from '~/components/variant.vue';
export default {
    name: 'Variant',
    props: {
        variants: {
            type: Array,
            require: true,
        }
    },
    emits: {

    },
    data() {
        return {

        }
    },
    methods: {
        variantClick(variant) {
            this.$emit('variant-click', variant);
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
    components: {
        // Variant
    }
}
</script>