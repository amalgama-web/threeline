import { Lines, Squares } from "~/logic/types";
import { Matrix } from "~/logic/classes";

export function markEmergingBoostersInMatrix(matrix: Matrix, hLines: Lines, vLines: Lines, squares: Squares) {
    for (let hLineID in hLines) {
        if (!hLines[hLineID].disabled && hLines[hLineID].booster) {
            const {r, c} = hLines[hLineID].booster!.coords;
            matrix[r][c].cell.emergingBooster = hLines[hLineID].booster;
        }
    }
    for (let vLineID in vLines) {
        if (!vLines[vLineID].disabled && vLines[vLineID].booster) {
            const {r, c} = vLines[vLineID].booster!.coords;
            matrix[r][c].cell.emergingBooster = vLines[vLineID].booster;
        }
    }
    for (let squareID in squares) {
        if (!squares[squareID].disabled && squares[squareID].booster) {
            const {r, c} = squares[squareID].booster!.coords;
            matrix[r][c].cell.emergingBooster = squares[squareID].booster;
        }
    }
}
