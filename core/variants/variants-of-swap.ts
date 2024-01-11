import { Variant } from '../types';
import { Matrix } from '../classes/Matrix';
import { markVariantsWithSunInDescendant } from '../variants/variants-with-sun-booster';
import { getPointsFromStepIteration } from '../variants/get-points-from-step-iteration';

// todo common: swap надо зашивать в матрицу при методе swapCells и вести построение бустера из этого значения

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];
    const initialSunBoosterCount = matrix.sunCounter;

    matrix.eachPossibleSwaps(swap => {
        const variationMatrix: Matrix = Matrix.copy(matrix)

        variationMatrix.swapCells(swap)

        const points = getPointsFromStepIteration(variationMatrix, swap);

        if (!points) return;

        const newSunBoosterCount = variationMatrix.sunCounter;
        variants.push({
                swap: swap,
                points: points,
                variantHasSun: initialSunBoosterCount < newSunBoosterCount,
                variantDescendantHasSun: false,
                childVariants: nextStepDepth === 0 ? null : getSwapVariants(variationMatrix, nextStepDepth - 1)
            }
        );
    })

    markVariantsWithSunInDescendant(variants)
    
    return variants;
}
