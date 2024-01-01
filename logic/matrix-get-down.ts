import { Cell, CellTypes, Matrix, ZeroCell } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_LAST_ROW, MATRIX_WIDTH } from "~/logic/constant-params";

export function matrixGetDown(matrix: Matrix) {
    const colsWithEmptyCells = [];

    // each column for
    for (let c = 0; c < MATRIX_WIDTH; c++) {
        let currentType = CellTypes.empty;
        for (let r = 0, colHasEmptyCells = false;
             r < MATRIX_HEIGHT && !colHasEmptyCells;
             r++)
        {
            if (matrix[r][c].type === CellTypes.empty && currentType !== CellTypes.empty) {
                colsWithEmptyCells.push(c);
                colHasEmptyCells = true;
            }
            currentType = matrix[r][c].type;
        }
    }

    colsWithEmptyCells.forEach(col => {
        columnGetDown(matrix, col)
    })
}

// todo ОК O(n) проход по столбцу один раз
function columnGetDown(matrix: Matrix, col: number) {
    /* Проходим один раз по колонке
    *  Перемещаем непустые ячейки вниз в строку currentRowIndexForFilling
    * */
    let currentRowIndexForFilling = MATRIX_LAST_ROW;
    let tmpCell: Cell | null = null;

    for (let r = MATRIX_LAST_ROW; r >= 0; r--) {
        if (matrix[r][col].type !== CellTypes.empty) {
            if (r !== currentRowIndexForFilling) {
                tmpCell = matrix[r][col];
                matrix[r][col] = new ZeroCell();
                matrix[currentRowIndexForFilling][col] = tmpCell;
                tmpCell = null;
            }
            currentRowIndexForFilling--;
        }
    }
}