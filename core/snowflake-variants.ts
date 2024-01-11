import { MATRIX_LAST_COL, MATRIX_LAST_ROW } from './constant-params';
import { matrixGetDown } from './matrix-get-down';
import { cutFiguresAndSetBoosters } from './cut/cut-figures';
import { getSwapVariants } from './variants/variants-of-swap';
import { highlightShapes } from './highlighting/highlight-shapes';
import {
    BoosterTypes,
    CellTypes,
    Coords,
    SnowflakeMoveDirections, SnowflakeMovingVariants,
    SnowflakeVariant
} from './types';
import { Matrix } from './classes/Matrix';
import { Cell } from './classes/Cell';
import { getPointsFromStepIteration } from './variants/get-points-from-step-iteration';


export function getSnowflakesVariants(matrix: Matrix) {
    const snowflakesCoords: Coords[] = findSnowflakes(matrix);
    const variants: SnowflakeMovingVariants[] = snowflakesCoords.map(({ r, c }: Coords) => calcSnowflakeMovingVariants(matrix, { r, c }))
    return variants
}

function findSnowflakes(matrix: Matrix): Coords[] {
    const snowflakesCoords: Coords[] = [];

    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell;
        const { r, c } = cellPointer.coords;
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


        variationMatrix.swapCells([
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

    // todo для снежинки сделать общую экспортируемую функцию по отметке удаляемых ячеек
    matrix[coords.r][coords.c].cell.type = CellTypes.empty
    matrix[coords.r][coords.c].cell.booster = null

    // todo сделать это через функции booster action
    if (coords.r > 0) markCellDeleted(matrix[coords.r - 1][coords.c].cell)
    if (coords.r < MATRIX_LAST_ROW) markCellDeleted(matrix[coords.r + 1][coords.c].cell)
    if (coords.c > 0) markCellDeleted(matrix[coords.r][coords.c - 1].cell)
    if (coords.c < MATRIX_LAST_COL) markCellDeleted(matrix[coords.r][coords.c + 1].cell)


    // todo это вынести в функцию итерацию
    points = matrix.totalPoints
    cutFiguresAndSetBoosters(matrix)
    matrix.reset();
    matrixGetDown(matrix)

    return points + getPointsFromStepIteration(matrix)

}


// todo вынести в одну функцию
function markCellDeleted(cell: Cell) {
    if (cell) {
        cell.isCellForRemoving = true;
    }
}
