import { Lines, Matrix, Squares } from "~/logic/types";

export function markEmergingBoostersInMatrix(matrix: Matrix, hLines: Lines, vLines: Lines, squares: Squares) {
    // todo разобраться тут, можно ли обойтись без ! хотя проверка и так уже есть, то есть это уже точне не null или undefined
    for (let hLineID in hLines) {
        if (!hLines[hLineID].disabled && hLines[hLineID].booster) {
            matrix[hLines[hLineID].booster!.coords.r][hLines[hLineID].booster!.coords.c]['emergingBooster'] = hLines[hLineID].booster;
        }
    }
    for (let vLineID in vLines) {
        if (!vLines[vLineID].disabled && vLines[vLineID].booster) {
            matrix[vLines[vLineID].booster!.coords.r][vLines[vLineID].booster!.coords.c]['emergingBooster'] = vLines[vLineID].booster;
        }
    }
    for (let squareID in squares) {
        if (!squares[squareID].disabled && squares[squareID].booster) {
            matrix[squares[squareID].booster!.coords.r][squares[squareID].booster!.coords.c]['emergingBooster'] = squares[squareID].booster;
        }
    }
}
