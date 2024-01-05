import { MATRIX_LAST_COL, MATRIX_LAST_ROW } from '~/logic/constant-params';
import { applyCellsSwap } from "~/logic/matrix-cell-swap";
import { matrixGetDown } from "~/logic/matrix-get-down";
import { resetMatrix } from '~/logic/reset-matrix/reset-matrix';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { getTotalPoints, getSwapVariants } from '~/logic/variants/variants-of-swap';
import { highlightShapes } from '~/logic/highlighting/highlighting';
import {
    BoosterTypes,
    Cell,
    CellTypes,
    Coords,
    SnowflakeMoveDirections, SnowflakeMovingVariants,
    SnowflakeVariant
} from '~/logic/types';
import { Matrix } from "~/logic/classes";


export function getSnowflakesVariants(matrix: Matrix) {
    const snowflakesCoords: Coords[] = findSnowflakes(matrix);
    const variants: SnowflakeMovingVariants[] = snowflakesCoords.map(({ r, c }: Coords) => calcSnowflakeMovingVariants(matrix, { r, c }))
    return variants
}

function findSnowflakes(matrix: Matrix): Coords[] {
    const snowflakesCoords: Coords[] = [];

    matrix.eachCell(cPointer => {
        const cell = cPointer.cell;
        const {r, c} = cPointer.coords;
        if (cell.booster === BoosterTypes.snowflake) {
            snowflakesCoords.push({ r, c })
        }
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

        const variationMatrix: Matrix = Matrix.copy(matrix);
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

    matrix[coords.r][coords.c].cell.type = CellTypes.empty
    matrix[coords.r][coords.c].cell.booster = null

    if (coords.r > 0) markCellDeleted(matrix[coords.r - 1][coords.c].cell)
    if (coords.r < MATRIX_LAST_ROW) markCellDeleted(matrix[coords.r + 1][coords.c].cell)
    if (coords.c > 0) markCellDeleted(matrix[coords.r][coords.c - 1].cell)
    if (coords.c < MATRIX_LAST_COL) markCellDeleted(matrix[coords.r][coords.c + 1].cell)

    points = getTotalPoints(matrix)
    cutFiguresAndSetBoosters(matrix)
    resetMatrix(matrix)
    matrixGetDown(matrix)

    let additionalPoints = 0;

    do {
        additionalPoints = 0
        highlightShapes(matrix);
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
