import { CellTypes, Coords } from '~/logic/types';
import { MATRIX_LAST_COL, MATRIX_LAST_ROW } from '~/logic/constant-params';
import { Matrix } from '~/logic/classes/matrix';

/*
* Заполнение матрицы
*
* Заполняем матрицу matrix на основании пустых ячеек в ней
* Сперва заполняем в новую матрицу и при этом проверяем чтобы в новых комбинациях ячеек не было фигур
* Далее мержим сгенерированное в исходную матрицу
* В смерженой матрице допускается появление фигур
*
* */

const possibleTypes: CellTypes[] = [
    CellTypes.yellow,
    CellTypes.red,
    CellTypes.blue,
    CellTypes.pink,
    CellTypes.purple,
]

export function fillMatrix(matrix: Matrix) {
    const matrixToFill = new Matrix();

    matrix.eachEmptyCell((cellPointer) => {
        fillCell(matrixToFill, { r: cellPointer.coords.r, c: cellPointer.coords.c })
    })

    mergeMatrices(matrix, matrixToFill)
}

function mergeMatrices(targetMatrix: Matrix, fromMatrix: Matrix) {
    targetMatrix.eachEmptyCell((cellPointer) => {
        const {r, c} = cellPointer.coords;
        cellPointer.cell.type = fromMatrix[r][c].cell.type
    });
}

function fillCell(matrix: Matrix, { r, c }: Coords) {
    const possibleTypesForCell: CellTypes[] = getPossibleTypesForCell(matrix, { r, c });
    matrix[r][c].cell.type = getRandType(possibleTypesForCell);
}

function getPossibleTypesForCell(matrix: Matrix, { r, c }: Coords) {
    const excludedTypes: Set<CellTypes> = new Set();

    // типы ячеек со смещением влево, вверх на 1, 2
    const l2type = getCellType(matrix, { r, c: c - 2 });
    const l1type = getCellType(matrix, { r, c: c - 1 });
    const t2type = getCellType(matrix, { r: r - 2, c });
    const t1type = getCellType(matrix, { r: r - 1, c });
    const t1l1type = getCellType(matrix, { r: r - 1, c: c - 1 });

    // предотвращаем образование hLine и квадрата
    if (l1type !== null && l1type !== CellTypes.empty) {
        if (l1type === l2type ||
            l1type === t1l1type && l1type === t1type) {
            excludedTypes.add(l1type)
        }
    }

    // предотвращаем образование vline
    if (t1type !== null && t1type !== CellTypes.empty && t1type === t2type) {
        excludedTypes.add(t1type)
    }

    return possibleTypes.filter((type: CellTypes) => !excludedTypes.has(type));
}

function getRandType(types: CellTypes[]) {
    return types[getRandomInt(types.length)]
}

function getCellType(matrix: Matrix, { r, c }: Coords): CellTypes | null {
    return isCellInsideMatrix(matrix, { r, c }) ? matrix[r][c].cell.type : null
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function isCellInsideMatrix(matrix: Matrix, { r, c }: Coords) {
    return r >= 0 && r <= matrix.lastRow && c >= 0 && c <= matrix.lastCol;
}