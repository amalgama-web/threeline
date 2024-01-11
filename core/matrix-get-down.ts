import { CellTypes } from './types';
import { Cell } from './classes/Cell';
import { Matrix } from './classes/Matrix';

export function matrixGetDown(matrix: Matrix) {
    const colsWithEmptyCells: number[] = [];

    // each column for
    // todo тут сразу можно сохранять колонки и отправлять их на сдвиг
    matrix.eachCol((col, c) => {
        let currentType = CellTypes.empty;
        for (let r = 0, colHasEmptyCells = false;
             r <= matrix.lastRow && !colHasEmptyCells;
             r++) {
            if (matrix[r][c].cell.type === CellTypes.empty && currentType !== CellTypes.empty) {
                colsWithEmptyCells.push(c);
                colHasEmptyCells = true;
            }
            currentType = matrix[r][c].cell.type;
        }
    })

    colsWithEmptyCells.forEach(col => {
        columnGetDown(matrix, col)
    })
}

function columnGetDown(matrix: Matrix, col: number) {
    /* Проходим один раз по колонке снизу вверх и сдвигаем все вниз заполняя пустоты
    *  Перемещаем непустые ячейки вниз в строку currentRowIndexForFilling
    * */
    let currentRowIndexForFilling = matrix.lastRow;
    let tmpCell: Cell | null = null;

    // todo тут можно обойтись только колонкой же
    for (let r = matrix.lastRow; r >= 0; r--) {
        if (matrix[r][col].cell.type !== CellTypes.empty) {
            if (r !== currentRowIndexForFilling) {
                tmpCell = matrix[r][col].cell;
                matrix[r][col].cell = new Cell();
                matrix[currentRowIndexForFilling][col].cell = tmpCell;
                tmpCell = null;
            }
            currentRowIndexForFilling--;
        }
    }
}