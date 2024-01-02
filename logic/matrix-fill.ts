import { CellTypes, Coords, createMatrix, Matrix } from "~/logic/types";
import { MATRIX_LAST_COL, MATRIX_LAST_ROW } from "~/logic/constant-params";

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
    // todo c классами тут утрясти по итогу все, для сгенерированной матрицы можно добавлять только тип без всей остальной инфы по ячейке
    const matrixToFill: Matrix = createMatrix();

    for (let r = 0; r <= MATRIX_LAST_ROW; r++) {
        for (let c = 0; c <= MATRIX_LAST_COL; c++) {
            if (matrix[r][c].type === CellTypes.empty) {
                fillCell(matrixToFill, { r, c })
            }
        }
    }

    mergeMatrices(matrix, matrixToFill)
}

function mergeMatrices(targetMatrix: Matrix, fromMatrix: Matrix) {
    for (let r = 0; r <= MATRIX_LAST_ROW; r++) {
        for (let c = 0; c <= MATRIX_LAST_COL; c++) {
            if (targetMatrix[r][c].type === CellTypes.empty) {
                targetMatrix[r][c].type = fromMatrix[r][c].type;
            }
        }
    }
}
function fillCell(matrix: Matrix, { r, c }: Coords) {
    const possibleTypesForCell: CellTypes[] = getPossibleTypesForCell(matrix, { r, c });
    matrix[r][c].type = getRandType(possibleTypesForCell);
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
    return isCellInsideMatrix({ r, c }) ? matrix[r][c].type : null
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function isCellInsideMatrix({ r, c }: Coords) {
    return r >= 0 && r <= MATRIX_LAST_ROW && c >= 0 && c <= MATRIX_LAST_COL;
}