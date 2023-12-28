import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from '~/logic/constant-params';
import {
    applyCellsSwap,
    applyCombinations,
    gridGetDown, resetMatrix,
    showVariantsWithSun
} from '~/logic/find-figures';
import { getTotalPoints, getCombinations } from '~/logic/combinations/combinations';
import { highlightFigures } from '~/logic/highlighting/highlighting';

export function checkSnowflakes(matrix) {
    const boosterVariants = []

    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {
            if (matrix[r][c]['booster'] === 'snowflake') {
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
                stepsAfter: showVariantsWithSun(getCombinations(variationMatrix, 2))
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
    applyCombinations(matrix)
    resetMatrix(matrix)
    gridGetDown(matrix)

    let additionalPoints = 0;

    do {
        additionalPoints = 0
        highlightFigures(matrix);
        additionalPoints = getTotalPoints(matrix);
        applyCombinations(matrix)
        resetMatrix(matrix)
        gridGetDown(matrix)
        points += additionalPoints;
    } while (additionalPoints > 0)

    return points

}

function markCellDeleted(cell) {
    if (cell) {
        cell.deleted = true;
    }
}
