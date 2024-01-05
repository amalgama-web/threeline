import { SwapCells } from '~/logic/types';
import { Matrix } from '~/logic/classes/matrix';

// todo перенести в метод для Matrix класса
export function applyCellsSwap(matrix: Matrix, swap: SwapCells) {
    let tmpCell = matrix[swap[0].r][swap[0].c].cell
    matrix[swap[0].r][swap[0].c].cell = matrix[swap[1].r][swap[1].c].cell
    matrix[swap[1].r][swap[1].c].cell = tmpCell
}