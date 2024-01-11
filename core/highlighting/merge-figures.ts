import { Lines, Squares } from '../types';
import { Matrix } from '../classes/Matrix';

// отмечаем пересекающиеся линии как солнце
export function mergeLinesAndSun(matrix: Matrix, hLines: Lines, vLines: Lines) {
    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell;
        if (cell.hLine && cell.vLine) {
            hLines[cell.hLine]['disabled'] = true
            vLines[cell.vLine]['disabled'] = true
            hLines[cell.hLine]['sunPart'] = true
            vLines[cell.vLine]['sunPart'] = true
        }
    })
}

// sunPart + квадрат - квадрат игнорируется
export function mergeSquaresAndSun(matrix: Matrix, squares: Squares, vLines: Lines, hLines: Lines) {
    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell
        if (cell.hLine && cell.square && hLines[cell.hLine].sunPart ||
            cell.vLine && cell.square && vLines[cell.vLine].sunPart) {
            squares[cell.square]['disabled'] = true
        }
    })

}

export function mergeLinesAndSquares(matrix: Matrix, hLines: Lines, vLines: Lines, squares: Squares) {
    matrix.eachCell(cellPointer => {
        const cell = cellPointer.cell;
        if (cell.hLine && cell.square) {
            if (hLines[cell.hLine]['length'] >= 4) {
                squares[cell.square]['disabled'] = true
            } else {
                hLines[cell.hLine]['disabled'] = true
            }
        }
        if (cell.vLine && cell.square) {
            if (vLines[cell.vLine]['length'] >= 4) {
                squares[cell.square]['disabled'] = true
            } else {
                vLines[cell.vLine]['disabled'] = true
            }
        }
    })
}
