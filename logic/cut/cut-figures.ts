import { Cell, CellTypes, Matrix } from "~/logic/types";

export function cutFiguresAndSetBoosters(matrix: Matrix) {
    matrix.forEach((row: Cell[]) => {
        row.forEach((cell: Cell) => {
            // todo для удаляемой ячейки с бустером оба условия выполняются как то не очень
            if (cell.isCellForRemoving) {
                cell.type = CellTypes.empty;
            }
            if (cell.emergingBooster) {
                cell.type = CellTypes.booster;
                // todo продумать будущий бустер и активный бустер по структуре как то оптимизировать
                cell.booster = cell.emergingBooster.type
            }
        })
    })
}
