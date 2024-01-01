import { Matrix, SwapCells } from "~/logic/types";

export function applyCellsSwap(matrix: Matrix, swap: SwapCells) {
    let tmpCell = matrix[swap[0].r][swap[0].c]
    matrix[swap[0].r][swap[0].c] = matrix[swap[1].r][swap[1].c]
    matrix[swap[1].r][swap[1].c] = tmpCell
}