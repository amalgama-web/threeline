import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes } from '~/logic/types';


export function applyCellsSwap(matrix, swap) {
    let tmpCell = matrix[swap[0].r][swap[0].c]
    matrix[swap[0].r][swap[0].c] = matrix[swap[1].r][swap[1].c]
    matrix[swap[1].r][swap[1].c] = tmpCell
}


// todo вынести в шаг getDown
export function matrixGetDown(matrix) {
    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {
            if (matrix[r][c].type === CellTypes.empty) {
                columnGetDown(matrix, r, c)
            }
        }
    }
}

// todo проработать тут вобще черте что
function columnGetDown(matrix, row, col) {
    for (let r = row; r > 0; r--) {
        matrix[r][col].type = matrix[r - 1][col].type;
        matrix[r][col].booster = matrix[r - 1][col].booster;
    }
    matrix[0][col].type = CellTypes.empty
    matrix[0][col].booster = null
}





