import { Squares, CellTypes, TypesForShapes } from '@/core/types';
import { Matrix } from '@/core/classes/Matrix';
import { isCellSuitableForShape } from '@/core/highlighting/find-shapes/is-cell-siutable-for-shapes'

export function findSquare(matrix: Matrix) {
    let foundSquares: Squares = {};
    let currentSquare: number = 1;

    matrix.eachCell(cellPointer => {
        const curType = cellPointer.cell.type;
        const {r, c} = cellPointer.coords;

        if (r === matrix.lastRow || c === matrix.lastCol) return;

        if (matrix[r + 1][c].cell.type === curType && isCellSuitableForShape(matrix[r + 1][c].cell) &&
            matrix[r][c + 1].cell.type === curType && isCellSuitableForShape(matrix[r][c + 1].cell) &&
            matrix[r + 1][c + 1].cell.type === curType && isCellSuitableForShape(matrix[r + 1][c + 1].cell)
        ) {
            foundSquares[`square${currentSquare++}`] = {
                coords: {
                    r,
                    c
                },
                disabled: false,
                booster: null,
            }
        }
    })


    return foundSquares;
}
