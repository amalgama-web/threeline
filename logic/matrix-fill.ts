import { Coords, Matrix } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from "~/logic/constant-params";

/*
* Заполнение матрицы
*
* Заполняем матрицу matrix на основании пустых ячеек в ней
* Сперва заполняем в новую матрицу и при этом проверям чтобы в новых комбинациях ячеек не было фигур
* Далее мержим сгенерированное в исходную матрицу
*
* */
export function fillMatrix(matrix: Matrix) {
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function isCellInsideMatrix({ r, c }: Coords) {
    return r >= 0 && r <= MATRIX_LAST_ROW && c >= 0 && c <= MATRIX_LAST_COL;
}