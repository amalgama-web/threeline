import { Variant } from '~/logic/types';

export function findSunInVariantsTree(variants: Variant[]) {
    checkSunInVariantDescendant(variants);
    return variants;
}

function checkSunInVariantDescendant(variants: Variant[]) {
    variants.forEach(variant => {
        variant.variantDescendantHasSun = variant.childVariants ? checkSunInVariantDescendant(variant.childVariants) : false
    })
    return variants.some(variant => variant.variantHasSun || variant.variantDescendantHasSun)
}