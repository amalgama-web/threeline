import { CellTypes, Coords, SwapCells, Variant } from '~/logic/types';
import { highlightShapes } from '~/logic/highlighting/highlight-shapes';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { Matrix } from '~/logic/classes/Matrix';
import { markVariantsWithSunInDescendant } from '~/logic/variants/variants-with-sun-booster';

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];
    const initialSunBoosterCount = matrix.sunCounter;

    matrix.eachPossibleSwaps(swap => {
        const variationMatrix: Matrix = Matrix.copy(matrix)
        variationMatrix.swapCells(swap)

        // todo вынести это в функцию получения очков
        // todo swap надо зашивать в матрицу при методе swapCells и вести построение бустера из этого значения
        let points = 0;
        let iterationPoints = 0;
        let initialCombination: SwapCells | null = swap;

        do {
            iterationPoints = 0;
            highlightShapes(variationMatrix, initialCombination);
            initialCombination = null;
            iterationPoints = variationMatrix.totalPoints;
            if (iterationPoints === 0) break;
            cutFiguresAndSetBoosters(variationMatrix)
            variationMatrix.reset();
            matrixGetDown(variationMatrix);
            points += iterationPoints;
        } while (iterationPoints !== 0)
        // todo конец функции


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

    // todo в этой функции мы только помечаем, не находим, само солнце находится в getSwapVariants
    markVariantsWithSunInDescendant(variants)
    
    return variants;
}
