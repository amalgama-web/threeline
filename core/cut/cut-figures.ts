import { CellTypes } from '../types';
import { Matrix } from '../classes/Matrix';


// todo переименовать cutShapes, вынести в класс матрицы
export function cutFiguresAndSetBoosters(matrix: Matrix) {
    matrix.eachCell(({ cell }) => {
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
}
