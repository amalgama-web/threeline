import { Variant } from "~/logic/types";

export function findSunInVariantsTree(variants: Variant[]) {
    findSunInArr(variants);

    return variants;
}

function findSunInArr(variants: Variant[]) {
    variants.forEach(variant => {
        variant.hasSun = variant.variantHasSunBooster || (variant.childVariants ? findSunInArr(variant.childVariants) : false)
    })
    return variants.some(variant => variant.hasSun)
}