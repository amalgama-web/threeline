import { BoosterTypes, Cell, CellTypes, Coords, SwapCells, Variant } from '~/logic/types';
import { highlightShapes } from '~/logic/highlighting/highlighting';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { applyCellsSwap } from '~/logic/matrix-cell-swap';
import { resetMatrix } from '~/logic/reset-matrix/reset-matrix';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { Matrix } from '~/logic/classes/matrix';

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];

    const initialSunBoosterCount = countSun(matrix);

    let variationMatrix: Matrix = Matrix.copy(matrix)

    variationMatrix.eachCell(cellPointer => {
        const {r, c} = cellPointer.coords;

        // vertical and horizontal swaps
        const orientationVariants = [
            {
                condition: c < matrix.lastCol,
                rowInc: 0,
                colInc: 1
            },
            {
                condition: r < matrix.lastRow,
                rowInc: 1,
                colInc: 0
            }
        ]


        orientationVariants.forEach(orientationVariant => {

            // return if it is last col or last row
            if (!orientationVariant.condition) return;

            // prevent boosters swap
            if (variationMatrix[r][c].cell.type === CellTypes.booster ||
                variationMatrix[r + orientationVariant.rowInc][c + orientationVariant.colInc].cell.type === CellTypes.booster) {
                return
            }

            applyCellsSwap(variationMatrix, [
                { r: r, c: c },
                { r: r + orientationVariant.rowInc, c: c + orientationVariant.colInc }
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
                    r: r + orientationVariant.rowInc,
                    c: c + orientationVariant.colInc
                }
            ]

            // todo заменить на рекурсию
            do {
                additionalPoints = 0;
                highlightShapes(variationMatrix, isInitialCombination ? initialCombination : null);
                additionalPoints = getTotalPoints(variationMatrix);
                cutFiguresAndSetBoosters(variationMatrix)
                resetMatrix(variationMatrix);
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
                            r: r + orientationVariant.rowInc,
                            c: c + orientationVariant.colInc
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
