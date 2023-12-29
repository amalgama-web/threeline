import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from '~/logic/constant-params';
import {
    applyCellsSwap,
    matrixGetDown,
    resetMatrix,
} from '~/logic/find-figures';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { getTotalPoints, getSwapVariants } from '~/logic/variants/variants-of-swap';
import { highlightFigures } from '~/logic/highlighting/highlighting';
import { BoosterTypes } from '~/logic/types';

export function checkSnowflakes(matrix) {
    const boosterVariants = []

    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {
            if (matrix[r][c]['booster'] === BoosterTypes.snowflake) {
                boosterVariants.push(calcSnowflake(matrix, {r, c}))
            }
        }
    }
    return boosterVariants

}

function calcSnowflake(matrix, coords) {

    const directions = [
        true,
        coords.r > 0,
        coords.c < MATRIX_LAST_COL,
        coords.r < MATRIX_LAST_ROW,
        coords.c > 0
    ]

    const directionsCoordsInc = [
        {
            r: 0,
            c: 0
        },
        {
            r: -1,
            c: 0
        },
        {
            r: 0,
            c: 1
        },
        {
            r: 1,
            c: 0
        },
        {
            r: 0,
            c: -1
        }
    ]

    let matrices = directions.map((directionExist, index) => {
        return directionExist ? JSON.parse(JSON.stringify(matrix)) : null
    })

    const variants = matrices.map((variationMatrix, index) => {
        if (variationMatrix) {
            applyCellsSwap(variationMatrix, [
                {r: coords.r, c: coords.c},
                {r: coords.r + directionsCoordsInc[index].r, c: coords.c + directionsCoordsInc[index].c}
            ])
            return {
                points: calcSnowflakeVariant(variationMatrix, {
                    r: coords.r + directionsCoordsInc[index].r,
                    c: coords.c + directionsCoordsInc[index].c
                }),
                childVariants: getSwapVariants(variationMatrix, 2)
            }

        }
        return null
    })


    return {
        'd': variants[0],
        't': variants[1],
        'r': variants[2],
        'b': variants[3],
        'l': variants[4],
    }

}

function calcSnowflakeVariant(matrix, coords) {
    let points = 0;

    matrix[coords.r][coords.c].type = null
    matrix[coords.r][coords.c].booster = null

    if (coords.r > 0) markCellDeleted(matrix[coords.r - 1][coords.c])
    if (coords.r < MATRIX_LAST_ROW) markCellDeleted(matrix[coords.r + 1][coords.c])
    if (coords.c > 0) markCellDeleted(matrix[coords.r][coords.c - 1])
    if (coords.c < MATRIX_LAST_COL) markCellDeleted(matrix[coords.r][coords.c + 1])


    points = getTotalPoints(matrix)
    cutFiguresAndSetBoosters(matrix)
    resetMatrix(matrix)
    matrixGetDown(matrix)

    let additionalPoints = 0;

    do {
        additionalPoints = 0
        highlightFigures(matrix);
        additionalPoints = getTotalPoints(matrix);
        cutFiguresAndSetBoosters(matrix)
        resetMatrix(matrix)
        matrixGetDown(matrix)
        points += additionalPoints;
    } while (additionalPoints > 0)

    return points

}

function markCellDeleted(cell) {
    if (cell) {
        cell.forRemoving = true;
    }
}
