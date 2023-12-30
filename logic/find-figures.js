import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes } from '~/logic/types';


export function applyCellsSwap(matrix, swap) {
    let tmpCell = matrix[swap[0].r][swap[0].c]
    matrix[swap[0].r][swap[0].c] = matrix[swap[1].r][swap[1].c]
    matrix[swap[1].r][swap[1].c] = tmpCell
}








