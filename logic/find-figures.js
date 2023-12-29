import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes } from '~/logic/types';


export const zeroCell = {
    type: null,
    highlighted: false,
    forRemoving: false,
    vLine: null,
    hLine: null,
    square: null,
    emergingBooster: null,
    booster: null,
}

export function getZeroCell() {
    return JSON.parse(JSON.stringify(zeroCell))
}

export function resetMatrix(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            cell.highlighted = false;
            cell.forRemoving = false;
            cell.hLine = null;
            cell.vLine = null;
            cell.square = null;
            cell.emergingBooster = null;
        })
    })
}


export function applyCellsSwap(matrix, swap) {
    let tmpCell = matrix[swap[0].r][swap[0].c]
    matrix[swap[0].r][swap[0].c] = matrix[swap[1].r][swap[1].c]
    matrix[swap[1].r][swap[1].c] = tmpCell
}

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





