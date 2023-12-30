import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from '~/logic/constant-params';
import {
    applyCellsSwap,
    matrixGetDown,
} from '~/logic/find-figures';
import { resetMatrix } from '~/logic/reset-matrix/reset-matrix';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { getTotalPoints, getSwapVariants } from '~/logic/variants/variants-of-swap';
import { highlightFigures } from '~/logic/highlighting/highlighting';
import {
    BoosterTypes,
    Cell,
    CellTypes,
    Coords,
    Matrix,
    SnowflakeMoveDirections, SnowflakeMovingVariants,
    SnowflakeVariant
} from '~/logic/types';


export function getSnowflakesVariants(matrix: Matrix) {
    const snowflakesCoords: Coords[] = findSnowflakes(matrix);
    const variants: SnowflakeMovingVariants[] = snowflakesCoords.map(({ r, c }: Coords) => calcSnowflakeMovingVariants(matrix, { r, c }))
    return variants
}

function findSnowflakes(matrix: Matrix): Coords[] {
    const snowflakesCoords: Coords[] = [];

    matrix.forEach((row: Cell[], r) => {
        row.forEach((cell: Cell, c) => {
            if (cell['booster'] === BoosterTypes.snowflake) {
                snowflakesCoords.push({ r, c })
            }
        })
    })

    return snowflakesCoords;
}

function calcSnowflakeMovingVariants(matrix: Matrix, { r: curRow, c: curCol }: Coords): SnowflakeMovingVariants {

    // возможные движения снежинки
    const directionsExisting = [
        true,
        curRow > 0,
        curCol < MATRIX_LAST_COL,
        curRow < MATRIX_LAST_ROW,
        curCol > 0
    ]

    // todo еще возможно вот так, но так более громоздко получается
    const directionsExisting2: {
        [key in SnowflakeMoveDirections]: boolean
    } = {
        [SnowflakeMoveDirections.default]: true,
        [SnowflakeMoveDirections.top]: curRow > 0,
        [SnowflakeMoveDirections.right]: curCol < MATRIX_LAST_COL,
        [SnowflakeMoveDirections.bottom]: curRow < MATRIX_LAST_ROW,
        [SnowflakeMoveDirections.left]: curCol > 0,
    }

    // прибавка координат по каждому направлению
    const directionsCoordsIncrement = [
        { r: 0, c: 0 },
        { r: -1, c: 0 },
        { r: 0, c: 1 },
        { r: 1, c: 0 },
        { r: 0, c: -1 }
    ]

    const variants: (SnowflakeVariant | null)[] = directionsExisting.map((directionExist, index): SnowflakeVariant | null => {
        if (!directionExist) return null;

        const variationMatrix: Matrix = JSON.parse(JSON.stringify(matrix));
        const rowInc = directionsCoordsIncrement[index].r;
        const colInc = directionsCoordsIncrement[index].c;

        applyCellsSwap(variationMatrix, [
            {
                r: curRow,
                c: curCol
            },
            {
                r: curRow + rowInc,
                c: curCol + colInc
            }
        ])
        return {
            points: calcPointsForSnowflake(variationMatrix, {
                r: curRow + rowInc,
                c: curCol + colInc
            }),
            childVariants: getSwapVariants(variationMatrix, 2)
        }
    })

    return {
        [SnowflakeMoveDirections.default]: variants[0],
        [SnowflakeMoveDirections.top]: variants[1],
        [SnowflakeMoveDirections.right]: variants[2],
        [SnowflakeMoveDirections.bottom]: variants[3],
        [SnowflakeMoveDirections.left]: variants[4],
    }

}

function calcPointsForSnowflake(matrix: Matrix, coords: Coords) {
    let points = 0;

    matrix[coords.r][coords.c].type = CellTypes.empty
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


// todo вынести в одну функцию
function markCellDeleted(cell: Cell) {
    if (cell) {
        cell.isCellForRemoving = true;
    }
}