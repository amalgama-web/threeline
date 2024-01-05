import { CellTypes } from '~/logic/types';
import { Cell } from '~/logic/classes/cell';
import { Matrix } from '~/logic/classes/matrix';

export function matrixGetDown(matrix: Matrix) {
    const colsWithEmptyCells: number[] = [];

    // each column for
    matrix.eachCol((col, c) => {
        let currentType = CellTypes.empty;
        for (let r = 0, colHasEmptyCells = false;
             r < matrix.height && !colHasEmptyCells;
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

// todo ОК O(n) проход по столбцу один раз
function columnGetDown(matrix: Matrix, col: number) {
    /* Проходим один раз по колонке
    *  Перемещаем непустые ячейки вниз в строку currentRowIndexForFilling
    * */
    let currentRowIndexForFilling = matrix.lastRow;
    let tmpCell: Cell | null = null;

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