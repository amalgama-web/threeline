import { BoosterTypes, CellTypes, Coords, Lines, Squares } from '../types';
import { Matrix } from '../classes/Matrix';

export function markDeletedForOrdinaryLines(matrix: Matrix, hLines: Lines, vLines: Lines) {
    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell;
        if (cell.hLine && !hLines[cell.hLine]['disabled'] ||
            cell.vLine && !vLines[cell.vLine]['disabled']) {
            cell.isCellForRemoving = true;
        }
    })
}

export function markDeletedForSquares(matrix: Matrix, squares: Squares) {
    matrix.eachCell( cPointer => {
        const cell = cPointer.cell;
        if (cell.square && !squares[cell.square]['disabled']) {
            cell.isCellForRemoving = true;
        }
    })
}

export function markDeletedForSun(matrix: Matrix) {
    const sunCentersCoords = findSunCenter(matrix)


    sunCentersCoords.forEach(sunCenterCoords => {
        const {r ,c} = sunCenterCoords;
        const sunRays = findSunRays(matrix, sunCenterCoords)
        markCellAsDeleted(matrix, sunCenterCoords)
        markCellAsEmergingSunBooster(matrix, sunCenterCoords)

        if (sunRays.r && !sunRays.l) {
            markCellAsDeleted(matrix, { r: r, c: c + 1 })
            markCellAsDeleted(matrix, { r: r, c: c + 2 })
        } else if (sunRays.l) {
            markCellAsDeleted(matrix, { r: r, c: c - 1 })
            markCellAsDeleted(matrix, { r: r, c: c - 2 })
        } else if (!sunRays.l && !sunRays.r) {
            markCellAsDeleted(matrix, { r: r, c: c - 1 })
            markCellAsDeleted(matrix, { r: r, c: c + 1 })
        }

        if (sunRays.t && !sunRays.b) {
            markCellAsDeleted(matrix, { r: r - 1, c: c })
            markCellAsDeleted(matrix, { r: r - 2, c: c })
        } else if (sunRays.b) {
            markCellAsDeleted(matrix, { r: r + 1, c: c })
            markCellAsDeleted(matrix, { r: r + 2, c: c })
        } else if (!sunRays.b && !sunRays.t) {
            markCellAsDeleted(matrix, { r: r - 1, c: c })
            markCellAsDeleted(matrix, { r: r + 1, c: c })
        }
    })

}

function markCellAsDeleted(matrix: Matrix, { r, c }: Coords) {
    matrix[r][c].cell.isCellForRemoving = true;
}

function markCellAsEmergingSunBooster(matrix: Matrix, { r, c }: Coords) {
    matrix[r][c].cell.emergingBooster = {
        type: BoosterTypes.sun,
        coords: { r, c }
    };
}

function findSunCenter(matrix: Matrix) {
    const sun: Coords[] = []
    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell;
        const {r ,c} = cellPointer.coords
        if (cell.hLine && cell.vLine) {
            sun.push({
                r,
                c
            })
        }
    })
    return sun
}

function findSunRays(matrix: Matrix, sunCenterCoords: Coords) {
    const {r, c} = sunCenterCoords;
    const currentType: CellTypes = matrix[r][c].cell.type

    const rayLeft = checkCellAndType(matrix, { r: r, c: c - 1 }, currentType) &&
        checkCellAndType(matrix, { r: r, c: c - 2 }, currentType)

    const rayRight = checkCellAndType(matrix, { r: r, c: c + 1 }, currentType) &&
        checkCellAndType(matrix, { r: r, c: c + 2 }, currentType)

    const rayTop = checkCellAndType(matrix, { r: r - 1, c: c }, currentType) &&
        checkCellAndType(matrix, { r: r - 2, c: c }, currentType)

    const rayBottom = checkCellAndType(matrix, { r: r + 1, c: c }, currentType) &&
        checkCellAndType(matrix, { r: r + 2, c: c }, currentType)

    return {
        l: rayLeft,
        r: rayRight,
        t: rayTop,
        b: rayBottom
    }
}

function checkCellAndType(matrix: Matrix, { r, c }: Coords, type: CellTypes) {
    return matrix.isCoordsInside({ r, c }) && matrix[r][c].cell.type === type
}
