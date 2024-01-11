import { Variant } from '../types';

export function markVariantsWithSunInDescendant(variants: Variant[]) {
    checkSunInVariantsDescendant(variants);
    return variants;
}

function checkSunInVariantsDescendant(variants: Variant[]) {
    variants.forEach(variant => {
        variant.variantDescendantHasSun = variant.childVariants ? checkSunInVariantsDescendant(variant.childVariants) : false
    })
    return variants.some(variant => variant.variantHasSun || variant.variantDescendantHasSun)
}