import { Variant } from "~/logic/types";

export function findSunInVariantsTree(variants: Variant[]) {
    findSunInArr(variants);

    return variants;
}

// todo сделать так чтобы у каждого шага был параметр
function findSunInArr(variants: Variant[]) {
    variants.forEach(variant => {
        variant.variantDescendantHasSun = variant.variantHasSun || (variant.childVariants ? findSunInArr(variant.childVariants) : false)
    })
    return variants.some(variant => variant.variantDescendantHasSun)
}