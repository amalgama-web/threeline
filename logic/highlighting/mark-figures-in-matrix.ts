import { Lines, Matrix, Squares } from "~/logic/types";

export function markHLinesInMatrix(matrix: Matrix, hLines: Lines) {
    // перебираем все горизонтальные линии
    for (let key in hLines) {
        for (let c = hLines[key].coords.c; c > hLines[key].coords.c - hLines[key].length; c--) {
            matrix[hLines[key].coords.r][c]['hLine'] = key;
        }
    }
}

export function markVLinesInMatrix(matrix: Matrix, hLines: Lines) {
    for (let key in hLines) {
        for (let i = hLines[key].coords.r; i > hLines[key].coords.r - hLines[key].length; i--) {
            matrix[i][hLines[key].coords.c]['vLine'] = key;
        }
    }
}


export function markSquaresInMatrix(matrix: Matrix, squares: Squares) {
    for (let key in squares) {
        matrix[squares[key].coords.r][squares[key].coords.c].square = key;
        matrix[squares[key].coords.r + 1][squares[key].coords.c].square = key;
        matrix[squares[key].coords.r][squares[key].coords.c + 1].square = key;
        matrix[squares[key].coords.r + 1][squares[key].coords.c + 1].square = key;
    }
}
