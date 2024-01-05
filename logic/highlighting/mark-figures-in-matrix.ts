import { Lines, Squares } from "~/logic/types";
import { Matrix } from "~/logic/classes";

export function markHLinesInMatrix(matrix: Matrix, hLines: Lines) {
    // перебираем все горизонтальные линии
    for (let key in hLines) {
        for (let c = hLines[key].coords.c; c > hLines[key].coords.c - hLines[key].length; c--) {
            matrix[hLines[key].coords.r][c].cell.hLine = key;
        }
    }
}

export function markVLinesInMatrix(matrix: Matrix, hLines: Lines) {
    for (let key in hLines) {
        for (let i = hLines[key].coords.r; i > hLines[key].coords.r - hLines[key].length; i--) {
            matrix[i][hLines[key].coords.c].cell.vLine = key;
        }
    }
}


export function markSquaresInMatrix(matrix: Matrix, squares: Squares) {
    for (let key in squares) {
        const {r, c} = squares[key].coords;
        matrix[r][c].cell.square = key;
        matrix[r + 1][c].cell.square = key;
        matrix[r][c + 1].cell.square = key;
        matrix[r + 1][c + 1].cell.square = key;
    }
}
