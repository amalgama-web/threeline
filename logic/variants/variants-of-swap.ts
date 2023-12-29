import { MATRIX_HEIGHT, MATRIX_WIDTH } from "~/logic/constant-params";
import { BoosterTypes, Cell, CellTypes, Coords, Matrix, SwapCells, Variant } from "~/logic/types";
import { highlightFigures } from "~/logic/highlighting/highlighting";
import { applyCellsSwap, matrixGetDown, resetMatrix } from "~/logic/find-figures";
import { cutFiguresAndSetBoosters } from "~/logic/cut/cut-figures";

export function getSwapVariants(matrix: Matrix, nextStepDepth = 0): Variant[] {
    const variants: Variant[] = [];

    const initialSunBoosterCount = countSun(matrix);

    let variationMatrix: Matrix = JSON.parse(JSON.stringify(matrix))

    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {

            // vertical and horizontal swaps
            const orientationVariants = [
                {
                    condition: c < MATRIX_WIDTH - 1,
                    rowInc: 0,
                    colInc: 1
                },
                {
                    condition: r < MATRIX_HEIGHT - 1,
                    rowInc: 1,
                    colInc: 0
                }
            ]


            orientationVariants.forEach(orientationVariant => {

                let isBoosters = false;

                // return if it is last col or last row
                if (!orientationVariant.condition) return;

                applyCellsSwap(variationMatrix, [
                    { r: r, c: c },
                    { r: r + orientationVariant.rowInc, c: c + orientationVariant.colInc }
                ])

                // prevent boosters swap
                if (variationMatrix[r][c]['type'] === CellTypes.booster ||
                    variationMatrix[r + orientationVariant.rowInc][c + orientationVariant.colInc]['type'] === CellTypes.booster) {
                    isBoosters = true;
                }

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

                do {
                    additionalPoints = 0;
                    highlightFigures(variationMatrix, isInitialCombination ? initialCombination : null);
                    additionalPoints = getTotalPoints(variationMatrix);
                    cutFiguresAndSetBoosters(variationMatrix)
                    resetMatrix(variationMatrix);
                    matrixGetDown(variationMatrix);
                    points += additionalPoints;
                    isInitialCombination = false;
                } while (additionalPoints !== 0)

                const newSunBoosterCount = countSun(variationMatrix);

                if (points && !isBoosters) {
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
                        variantHasSunBooster: initialSunBoosterCount < newSunBoosterCount,
                        childVariants: nextStepDepth === 0 ? null : getSwapVariants(variationMatrix, nextStepDepth - 1)

                    }

                    variants.push(variant);

                }

                variationMatrix = JSON.parse(JSON.stringify(matrix))

            })
        }
    }


    return variants;
}

function countSun(matrix: Matrix) {
    return matrix.reduce((sum: number, row: Cell[]) => sum + row.reduce((sum: number, cell: Cell) => {
        if (cell.booster === BoosterTypes.sun) return sum + 1;
        return sum
    }, 0), 0)
}

export function getTotalPoints(matrix: Matrix) {
    return matrix.reduce(
        (sum: number, row: Cell[]) => {
            return sum + row.reduce((sum: number, cell: Cell) => {
                return sum + +cell.forRemoving
            }, 0)
        }, 0
    )
}
