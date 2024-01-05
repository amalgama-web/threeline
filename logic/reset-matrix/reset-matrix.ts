import { Cell } from '~/logic/classes/cell';
import { Matrix } from '~/logic/classes/matrix';

export function resetMatrix(matrix: Matrix) {
    matrix.eachCell(cellPointer => {
        const cell: Cell = cellPointer.cell;
        cell.isCellInShape = false;
        cell.isCellForRemoving = false;
        cell.hLine = null;
        cell.vLine = null;
        cell.square = null;
        cell.emergingBooster = null;
    })
}
