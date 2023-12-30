// todo вынести в шаг getDown
import { Coords, Matrix } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_WIDTH } from "~/logic/constant-params";
import { CellTypes } from "~/logic/types";

export function matrixGetDown(matrix: Matrix) {
    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {
            if (matrix[r][c].type === CellTypes.empty) {
                columnGetDown(matrix, {r, c})
            }
        }
    }
}

// todo проработать тут вобще черте что
function columnGetDown(matrix: Matrix, { r: row, c: col }: Coords) {
    for (let r = row; r > 0; r--) {
        matrix[r][col].type = matrix[r - 1][col].type;
        matrix[r][col].booster = matrix[r - 1][col].booster;
    }
    matrix[0][col].type = CellTypes.empty
    matrix[0][col].booster = null
}