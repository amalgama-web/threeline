import { CellTypes, Coords, SwapCells, Variant } from '~/logic/types';
import { highlightShapes } from '~/logic/highlighting/highlight-shapes';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { Matrix } from '~/logic/classes/Matrix';

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];

    const initialSunBoosterCount = countSun(matrix);

    let variationMatrix: Matrix = Matrix.copy(matrix)

    variationMatrix.eachCell(cellPointer => {
        const {r, c}: Coords = cellPointer.coords;

        // vertical and horizontal swaps
        const swapOrientations: {
            isSwapPossible: boolean,
            rInc: 0 | 1,
            cInc: 0 | 1
        }[] = [
            {
                isSwapPossible: c < matrix.lastCol,
                rInc: 0,
                cInc: 1
            },
            {
                isSwapPossible: r < matrix.lastRow,
                rInc: 1,
                cInc: 0
            }
        ]


        swapOrientations.forEach(({ isSwapPossible, rInc, cInc }) => {

            // return if it is last col or last row
            if (!isSwapPossible) return;

            // prevent boosters swap
            if (variationMatrix[r][c].cell.type === CellTypes.booster ||
                variationMatrix[r + rInc][c + cInc].cell.type === CellTypes.booster) {
                return
            }

            variationMatrix.swapCells([
                { r: r, c: c },
                { r: r + rInc, c: c + cInc }
            ])

            let points = 0;
            let additionalPoints = 0;
            let isInitialCombination = true;
            const initialCombination: SwapCells = [
                {
                    r,
                    c
                },
                {
                    r: r + rInc,
                    c: c + cInc
                }
            ]

            // todo заменить на рекурсию или вынести в фукнцию рассчета остаточных очков
            do {
                additionalPoints = 0;
                highlightShapes(variationMatrix, isInitialCombination ? initialCombination : null);
                additionalPoints = getTotalPoints(variationMatrix);
                cutFiguresAndSetBoosters(variationMatrix)
                variationMatrix.reset();
                matrixGetDown(variationMatrix);
                points += additionalPoints;
                isInitialCombination = false;
            } while (additionalPoints !== 0)

            const newSunBoosterCount = countSun(variationMatrix);

            if (points) {
                const variant: Variant = {
                    swap: [
                        {
                            r,
                            c
                        },
                        {
                            r: r + rInc,
                            c: c + cInc
                        },
                    ],
                    points: points,
                    variantHasSun: initialSunBoosterCount < newSunBoosterCount,
                    childVariants: nextStepDepth === 0 ? null : getSwapVariants(variationMatrix, nextStepDepth - 1)

                }

                variants.push(variant);

            }

            variationMatrix = Matrix.copy(matrix)

        })
    })

    return variants;
}

function countSun(matrix: Matrix) {
    return matrix.sunCounter;
}

export function getTotalPoints(matrix: Matrix) {
    return matrix.totalPoints;
}
