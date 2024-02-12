<template lang="pug">
.variants
  div(v-for="variant in variants" )
    .variants__list-item
      .variants__link(
        @click="variantClick(variant)"
        @mouseover="variantMouseover(variant)"
        @mouseleave="variantMouseleave(variant)"
        :style="variantStyle(variant)"
        :class="variantClasses(variant)"
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
  emits: [
    'variant-click',
    'variant-mouseover',
    'variant-mouseleave',
  ],
  data() {
    return {}
  },

  computed: {},
  methods: {
    variantClasses(variant) {
      return {
        'has-sun': variant.variantHasSun,
        'has-sun-in-descendant': variant.variantDescendantHasSun
      }
    },

    variantClick(variant) {
      this.$emit('variant-click', variant);
    },
    variantMouseover(variant) {
      this.$emit('variant-mouseover', variant);
    },
    variantMouseleave(variant) {
      this.$emit('variant-mouseleave', variant);
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
    },
  },
}
</script>

<style lang="scss" src="/styles/variants.scss"></style>