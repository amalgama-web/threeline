<template lang="pug">
div.variants
    div(v-for="variant in variants" )
        .variants__list-item
            .variants__link(
                @click="variantClick(variant)"
                :style="variantStyle(variant)"
                :class="{'has-sun':  variant.variantHasSun}"
            ) {{`${variant.swap[0].r}${variant.swap[0].c}:${variant.swap[1].r}${variant.swap[1].c} Points: ${variant.points}`}}

            .variants__popup(v-if="variant.childVariants")
                variant(:variants="variant.childVariants")

</template>

<script>
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
}
</script>

<style lang="scss" src="/styles/variants.scss"></style>