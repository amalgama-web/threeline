import { CellTypes, Coords, SwapCells, Variant } from '~/logic/types';
import { highlightShapes } from '~/logic/highlighting/highlight-shapes';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { Matrix } from '~/logic/classes/Matrix';

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];
    const initialSunBoosterCount = matrix.sunCounter;
    let variationMatrix: Matrix = Matrix.copy(matrix)

    // todo тут матрикс, и сразу первым шагом делать копию уже внутри
    variationMatrix.eachPossibleSwap(swap => {

        variationMatrix.swapCells(swap)

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


        if (points) {
            const newSunBoosterCount = variationMatrix.sunCounter;
            variants.push({
                    swap: swap,
                    points: points,
                    variantHasSun: initialSunBoosterCount < newSunBoosterCount,
                    childVariants: nextStepDepth === 0 ? null : getSwapVariants(variationMatrix, nextStepDepth - 1)
                }
            );

        }

        // todo вверх вынести
        variationMatrix = Matrix.copy(matrix)
    })

    return variants;
}
