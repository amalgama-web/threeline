import { Squares, CellTypes, TypesForShapes } from '../../types';
import { Matrix } from '../../classes/Matrix';

export function findSquare(matrix: Matrix) {
    let foundSquares: Squares = {};
    let currentSquare: number = 1;

    matrix.eachCell(cellPointer => {
        const curType = cellPointer.cell.type;
        const {r, c} = cellPointer.coords;

        if (r === matrix.lastRow || c === matrix.lastCol) return;

        if (TypesForShapes.includes(curType) &&
            matrix[r + 1][c].cell.type === curType &&
            matrix[r][c + 1].cell.type === curType &&
            matrix[r + 1][c + 1].cell.type === curType
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
