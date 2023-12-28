import { BoosterTypes, Cell, CellTypes, Coords, Lines, Matrix, Squares } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_WIDTH } from "~/logic/constant-params";

export function markDeletedForOrdinaryLines(matrix: Matrix, hLines: Lines, vLines: Lines) {
    matrix.forEach((row: Cell[]) => {
        row.forEach((cell: Cell) => {
            if (cell.hLine && !hLines[cell.hLine]['disabled'] ||
                cell.vLine && !vLines[cell.vLine]['disabled']) {
                cell.forRemoving = true;
            }
        })
    })
}

export function markDeletedForSquares(matrix: Matrix, squares: Squares) {
    matrix.forEach((row: Cell[]) => {
        row.forEach((cell: Cell) => {
            if (cell.square && !squares[cell.square]['disabled']) {
                cell.forRemoving = true;
            }
        })
    })
}

export function markDeletedForSun(matrix: Matrix) {
    const sunCentersCoords = findSunCenter(matrix)

    sunCentersCoords.forEach(sunCenterCoords => {
        const sunRays = findSunRays(matrix, sunCenterCoords)
        markCellAsDeleted(matrix, sunCenterCoords)
        markCellAsBooster(matrix, sunCenterCoords)

        if (sunRays.r && !sunRays.l) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 2})
        } else if (sunRays.l) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 2})
        } else if (!sunRays.l && !sunRays.r) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1})
        }

        if (sunRays.t && !sunRays.b) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 2, c: sunCenterCoords.c})
        } else if (sunRays.b) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 2, c: sunCenterCoords.c})
        } else if (!sunRays.b && !sunRays.t) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c})
        }
    })

}

function markCellAsDeleted(matrix: Matrix, coords: Coords) {
    matrix[coords.r][coords.c]['forRemoving'] = true;
}

function markCellAsBooster(matrix: Matrix, coords: Coords) {
    matrix[coords.r][coords.c]['emergingBooster'] = {
        type: BoosterTypes.sun,
        coords: {r: coords.r, c: coords.c}
    };
}

function findSunCenter(matrix: Matrix) {
    const sun: Coords[] = []
    matrix.forEach((row: Cell[], rIndex: number) => {
        row.forEach((cell: Cell, cIndex: number) => {
            if (cell.hLine && cell.vLine) {
                sun.push({
                    r: rIndex,
                    c: cIndex
                })
            }
        })
    })
    return sun
}

function findSunRays(matrix: Matrix, sunCenterCoords: Coords) {
    const currentType: CellTypes = matrix[sunCenterCoords.r][sunCenterCoords.c].type

    const rayLeft = checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 2}, currentType)

    const rayRight = checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 2}, currentType)

    const rayTop = checkCellAndType(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r - 2, c: sunCenterCoords.c}, currentType)

    const rayBottom = checkCellAndType(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r + 2, c: sunCenterCoords.c}, currentType)

    return {
        l: rayLeft,
        r: rayRight,
        t: rayTop,
        b: rayBottom
    }
}

function checkCellAndType(matrix: Matrix, coords: Coords, type: CellTypes) {
    return checkIsCellExist(coords) && matrix[coords.r][coords.c].type === type
}

function checkIsCellExist(coords: Coords) {
    return coords.r > 0 && coords.r < MATRIX_HEIGHT &&
           coords.c > 0 && coords.c < MATRIX_WIDTH
}