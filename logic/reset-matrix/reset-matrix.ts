import { Matrix, Cell } from "~/logic/types";

export function resetMatrix(matrix: Matrix) {
    matrix.forEach((row: Cell[]) => {
        row.forEach((cell: Cell) => {
            cell.isCellInFigure = false;
            cell.isCellForRemoving = false;
            cell.hLine = null;
            cell.vLine = null;
            cell.square = null;
            cell.emergingBooster = null;
        })
    })
}
